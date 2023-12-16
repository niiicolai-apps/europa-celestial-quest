import { ref } from 'vue'
import { getMesh } from '../composables/meshes.js'
import { useItems } from './constructions.js'
import { useUnits } from './units.js'
import { useStateMachine } from './state_machine.js'
import { useManager } from './manager.js'
import ConstructionDefinitions from './definitions/constructions.js'
import ComputerBehavior from './behaviors/computer_behavior.json'
import ComputerStates from './states/computer_states.js'
import { useCanvas } from '../composables/canvas.js'

const players = ref([])
const scene = ref(null)
const isInitialized = ref(false)

const Player = (isComputer=false, team=null) => {
    const stateMachineId = Date.now();
    if (!team) team = `team-${players.value.length + 1}`

    const spawnUnit = async (unitData) => {
        const mesh = await getMesh(unitData.mesh)
        if (!mesh) {
            throw new Error(`Mesh not found: ${unitData.mesh}`)
        }

        scene.value.add(mesh)
        const units = useUnits()
        units.add(mesh, unitData, team)
        return mesh
    }

    const spawnConstruction = async (constructionName) => {
        const definition = Object.values(ConstructionDefinitions).find(d => d.name === constructionName)
        if (!definition) {
            throw new Error(`Construction definition not found: ${constructionName}`)
        }

        const items = useItems()
        const isOwned = isComputer ? true : false
        return await items.spawn(definition, team, isOwned)
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

    return {
        team,
        isComputer,
        spawnUnit,
        spawnConstruction,
        setUnitsStateByPrimaryFunction,
        setUnitsCommand,
        setState,
        stateMachineId,
        isDead
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
            usePlayers().add(false, 'player')
            isInitialized.value = true;
        }
    }
})

export const usePlayers = () => {

    const add = (isComputer=false, teamName=null, difficulty='easy') => {
        const player = Player(isComputer, teamName, difficulty)
        
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

    const findAll = (isDead=false, isComputer=false) => {
        return players.value.filter(p => p.isComputer === isComputer && p.isDead() === isDead)
    }

    return {
        add,
        get,
        remove,
        findAll
    }
}
