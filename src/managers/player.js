import { ref } from 'vue'
import { getMesh } from '../composables/meshes.js'
import { useItems } from './constructions.js'
import { useUnits } from './units.js'
import { useStateMachine } from './state_machine.js'
import { useManager } from './manager.js'
import { useMap } from './map.js'
import { useCanvas } from '../composables/canvas.js'
import { useInspect } from './inspect.js'
import ConstructionDefinitions from './definitions/constructions.js'
import ComputerBehavior from './behaviors/computer_behavior.json'
import ComputerStates from './states/computer_states.js'
import PersistentData from '../composables/persistent_data.js'


const players = ref([])
const scene = ref(null)
const mapName = ref('map1')
const isInitialized = ref(false)

const Player = (isComputer=false, isYou=false, team=null) => {
    const stateMachineId = Date.now();
    if (!team) team = `team-${players.value.length + 1}`

    const spawnUnit = async (unitData) => {
        const units = useUnits()
        const mesh = await getMesh(unitData.mesh)
        if (!mesh) {
            throw new Error(`Mesh not found: ${unitData.mesh}`)
        }

        scene.value.add(mesh)
        units.add(mesh, unitData, team)

        return mesh
    }

    const spawnConstruction = async (constructionName) => {
        const items = useItems()
        const definition = Object.values(ConstructionDefinitions).find(d => d.name === constructionName)
        if (!definition) {
            throw new Error(`Construction definition not found: ${constructionName}`)
        }
        
        const isOwned = isComputer ? true : false
        const item = await items.spawn(definition, team, isOwned)

        /**
         * Ensure all constructions are selectable.
         */
        useInspect().addSelectable(item)

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
        const items = useItems()
        const constructions = items.findAllByTeam(team)
        const constructionsData = []
        for (const construction of constructions) {
            constructionsData.push({
                name: construction.name,
                position: {
                    x: construction.position.x,
                    y: construction.position.y,
                    z: construction.position.z
                },
                rotation: {
                    x: radToDeg(construction.rotation.x), 
                    y: radToDeg(construction.rotation.y), 
                    z: radToDeg(construction.rotation.z)
                },
                userData: construction.userData,
                uuid: construction.uuid
            })
        }

        /**
         * 2. Create units data
         */
        const units = useUnits()
        const unitsData = units.findAllByTeam(team)
        const unitsDataData = []
        for (const unit of unitsData) {
            const object3D = unit.object3D
            unitsDataData.push({
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
         * 3. Create player data
         */
        const data = {
            is_computer: isComputer,
            team_name: team,
            difficulty: 'easy',
            constructions: constructionsData,
            units: unitsDataData
        }

        /**
         * 4. Find existing PD players and update
         */
        const pdPlayers = await PersistentData.get(`${mapName.value}-players`) || []
        const pdIndex = pdPlayers.findIndex(p => p.team_name === team)
        if (pdIndex !== -1) pdPlayers[pdIndex] = data
        else pdPlayers.push(data)

        /**
         * 5. Save PD players
         */
        await PersistentData.set(`${mapName.value}-players`, pdPlayers)
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

    const add = (isComputer=false, isYou=false, teamName=null, difficulty='easy') => {
        const player = Player(isComputer, isYou, teamName)
        
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
