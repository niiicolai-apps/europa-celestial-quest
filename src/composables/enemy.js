import { getMesh } from './meshes.js'
import { useMap } from '../managers/map.js'
import { useItems } from '../managers/constructions.js'
import { useUnits } from '../managers/units.js'
import { usePlayers } from '../managers/player.js'
import { useStateMachine } from '../managers/state_machine.js'
import { useManager } from '../managers/manager.js'
import { useCanvas } from './canvas.js'
import { ref } from 'vue'

import ComputerBehavior from './behaviors/computer_behavior.json'
import ComputerStates from './states/computer_states.js'

const players = usePlayers()
const enemyPlayer = ref(null)
const enemyData = ref(null)
const isInitialized = ref(false)
const armyIsSpawned = ref(false)
const armyCommand = ref({ type: 'idle' })
const spawnInterval = ref(null)
const scene = ref(null)

const spawnUnit = async (unitData, point) => {
    const unitsManager = useUnits()
    const mesh = await getMesh(unitData.name)
    if (!mesh) return

    mesh.position.x = point.x + (unitData.instances.length + 1);
    mesh.position.y = point.y;
    mesh.position.z = point.z;
    mesh.rotation.x = 0;
    mesh.rotation.y = 0;
    mesh.rotation.z = 0;
    scene.value.add(mesh)
    unitsManager.add(mesh, unitData.spawnData, 'enemy')
    return mesh
}

const spawnUnits = async () => {
    if (armyIsSpawned.value) return

    let allUnitsSpawned = true
    
    for (const construction of constructions.value) {
        if (construction.spawn) {
            const { point, units } = construction.spawn

            for (const unitData of units) {
                if (unitData.instances.length > unitData.count) {
                    continue
                }       
                console.log(`Spawning ${unitData.name}`, unitData.instances.length, unitData.count)

                const mesh = await spawnUnit(unitData, point)
                unitData.instances.push(mesh)
                allUnitsSpawned = false   
            }
        }
    }

    armyIsSpawned.value = allUnitsSpawned
}

const spawnConstructions = async () => {
    for (const construction of enemyData.value.constructions) {
        const mesh = await enemyPlayer.value.spawnConstruction(construction.name)
        mesh.position.x = construction.position.x
        mesh.position.y = construction.position.y
        mesh.position.z = construction.position.z
        mesh.rotation.x = construction.rotation.x * Math.PI / 180
        mesh.rotation.y = construction.rotation.y * Math.PI / 180
        mesh.rotation.z = construction.rotation.z * Math.PI / 180
        scene.value.add(mesh)
    }
}

const unitsBehaviour = async () => {
    if (!armyIsSpawned.value) {
        await spawnUnits()
        return
    }

    if (armyCommand.value.type !== 'attack') {
        armyCommand.value.type = 'attack'
        useUnits().setCommand('attack', { "x": 246, "y": 20, "z": -423 }, 'enemy');
        useUnits().setStateByFunction('warrior', 'attack', 'enemy')
        console.log('Attack!')
    }
}

/**
 * Manager methods.
 * Will be called by the manager.
 */ 
useManager().create('enemy', {
    init: {
        priority: 1,
        callback: async () => {
            if (isInitialized.value) return false
    
            const map = useMap()
            enemyData.value = await map.enemy()
    
            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            
            scene.value = adapter.scene
            enemyPlayer.value = players.add(true, null, 'easy')
            
            await spawnConstructions()
            
            isInitialized.value = true;
        }
    }
})

export const useEnemy = () => {


    return {
    }
}
