import { ref } from 'vue'
import { getMesh } from '../models/meshes.js'
import { useItems } from '../constructions/constructions.js'
import { useUnits } from '../units/units.js'
import { useStateMachine } from '../state_machine/state_machine.js'
import { useManager } from '../managers/manager.js'
import { useMap } from '../map/map.js'
import { useCanvas } from '../../composables/canvas.js'
import { useInspect } from '../inspect/inspect.js'
import { useStats } from '../stats/stats.js'
import { useBank } from '../bank/bank.js'
import { useMax } from '../map/max.js'

import ConstructionDefinitions from '../definitions/constructions.js'
import ComputerBehavior from '../state_machine/behaviors/computer_behavior.json'
import ComputerStates from '../state_machine/states/computer_states.js'
import PersistentData from '../persistent_data/persistent_data.js'

const players = ref([])
const scene = ref(null)
const mapName = ref('map1')
const isInitialized = ref(false)

const Player = async (isComputer=false, isYou=false, team=null, level=1, experience=10, startAccounts=[]) => {
    const stateMachineId = Date.now();
    if (!team) team = `team-${players.value.length + 1}`

    const stats = useStats()
    const statsController = await stats.create(team, level, experience)

    const banks = useBank()
    const bankController = await banks.create(team, startAccounts)

    const maxManager = useMax()
    const maxController = await maxManager.add(team)

    const spawnUnit = async (unitData, byPassMax=false) => {
        if (!byPassMax && maxController.hasReachedMaxUnits()) {
            throw new Error(`Max constructions reached: ${maxController.units.max}`)
        }

        const units = useUnits()
        const mesh = await getMesh(unitData.mesh)
        if (!mesh) {
            throw new Error(`Mesh not found: ${unitData.mesh}`)
        }

        await units.add(mesh, unitData, team)
        mesh.name = unitData.name

        return mesh
    }

    const spawnConstruction = async (constructionName, isOwned=false, upgradeIndex = 0, byPassMax=false) => {
        
        const definition = Object.values(ConstructionDefinitions).find(d => d.name === constructionName)
        if (!definition) {
            throw new Error(`Construction definition not found: ${constructionName}`)
        }

        if (!byPassMax && maxController.hasReachedMaxConstructions()) {
            throw new Error(`Max constructions reached: ${maxController.constructions.max}`)
        }
        
        const items = useItems()
        const item = await items.spawn(definition, team, isOwned, upgradeIndex)

        /**
         * Check if definition is max_increaser
         */
        maxController.recalculateMax();

        return item
    }

    const setUnitsStateByPrimaryFunction = (stateName, primaryFunction='warrior') => {
        const units = useUnits()
        units.setStateByFunction(primaryFunction, stateName, team)
        console.log(`Setting units state to ${stateName} by primary function ${primaryFunction}`)
    }

    const setUnitsCommand = (type, position) => {
        const units = useUnits()
        units.setCommand(type, position, team)
    }

    const setState = (stateName) => {
        const stateMachine = useStateMachine()
        stateMachine.setState(stateMachineId, stateName)
    }

    const addExperience = (experience) => {
        stats.addExperience(team, experience)
    }

    const isDead = () => {
        const units = useUnits()
        const constructions = useItems()
        const unitsCount = units.countByTeam(team)
        const constructionsCount = constructions.countByTeam(team)
        return unitsCount === 0 && constructionsCount === 0        
    }

    const saveData = async () => {
        const radToDeg = (rad) => rad * 180 / Math.PI

        /**
         * 1. Create constructions data
         */
        const constructionsData = useItems().findAllByTeam(team)
        const constructions = []
        for (const construction of constructionsData) {
            constructions.push({
                name: construction.definition.name,
                position: {
                    x: construction.object3D.position.x,
                    y: construction.object3D.position.y,
                    z: construction.object3D.position.z
                },
                rotation: {
                    x: radToDeg(construction.object3D.rotation.x), 
                    y: radToDeg(construction.object3D.rotation.y), 
                    z: radToDeg(construction.object3D.rotation.z)
                },
                upgradeIndex: construction.upgradeIndex,
                uuid: construction.object3D.uuid
            })
        }

        /**
         * 2. Create units data
         */
        const unitsData = useUnits().findAllByTeam(team)
        const units = []
        for (const unit of unitsData) {
            const object3D = unit.object3D
            units.push({
                name: object3D.name,
                position: {
                    x: object3D.position.x,
                    y: object3D.position.y,
                    z: object3D.position.z
                },
                rotation: {
                    x: radToDeg(object3D.rotation.x), 
                    y: radToDeg(object3D.rotation.y), 
                    z: radToDeg(object3D.rotation.z)
                },
                userData: object3D.userData,
                uuid: object3D.uuid
            })
        }

        /**
         * 3. Get stats data
         */
        const stat = stats.findStat(team)
        const level = stat.level
        const experience = stat.experience

        /**
         * 4. Find bank accounts data
         */
        const bankAccounts = bankController.accounts.value

        /**
         * 4. Create player data
         */
        const data = {
            is_computer: isComputer,
            team_name: team,
            difficulty: 'easy',
            is_you: isYou,
            constructions,
            units,
            level,
            experience,
            bankAccounts
        }

        /**
         * 5. Find existing PD players and update
         */
        const pdPlayers = await PersistentData.getPlayers() || []
        const pdIndex = pdPlayers.findIndex(p => p.team_name === team)
        if (pdIndex !== -1) pdPlayers[pdIndex] = data
        else pdPlayers.push(data)

        /**
         * 6. Save PD players
         */
        await PersistentData.setPlayers(pdPlayers)
    }

    const getStat = () => {
        return stats.findStat(team)
    }

    return {
        team,
        isYou,
        isComputer,
        spawnUnit,
        spawnConstruction,
        setUnitsStateByPrimaryFunction,
        setUnitsCommand,
        setState,
        stateMachineId,
        addExperience,
        bankController,
        maxController,
        getStat,
        isDead,
        saveData
    }
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('players', {
    init: {
        priority: 1, // Must be lower than resources.js
        callback: async () => {
            if (isInitialized.value) return false
            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            scene.value = adapter.scene
            isInitialized.value = true;

            const map = useMap()
            mapName.value = await map.name()
        }
    }
})

export const usePlayers = () => {

    const add = async (isComputer=false, isYou=false, teamName=null, difficulty='easy', level=1, experience=10, startAccounts=[]) => {
        const player = await Player(isComputer, isYou, teamName, level, experience, startAccounts)
        
        players.value.push(player)

        if (isComputer) {
            const stateMachine = useStateMachine()
            const behavior = ComputerBehavior[difficulty]
            const states = ComputerStates;
            stateMachine.add(player, player.stateMachineId, behavior, states);
        }

        return player
    }

    const get = (team) => {
        return players.value.find(p => p.team === team)
    }

    const remove = (team) => {
        const index = players.value.findIndex(p => p.team === team)
        if (index !== -1) {
            players.value.splice(index, 1)
        }
    }

    const findAll = (isDead=false, isComputer=false, isYou=false) => {
        return players.value.filter(p => p.isComputer === isComputer && p.isDead() === isDead && p.isYou === isYou)
    }

    const findYou = () => {
        return players.value.find(p => p.isYou)
    }

    const savePlayers = async () => {
        for (const player of players.value) {
            await player.saveData()
        }
    }

    return {
        add,
        get,
        remove,
        findAll,
        findYou,
        savePlayers
    }
}
