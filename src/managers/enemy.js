import { useMap } from './map.js'
import { usePlayers } from './player.js'
import { useManager } from './manager.js'
import { useCanvas } from '../composables/canvas.js'
import { ref } from 'vue'

const players = usePlayers()
const enemyPlayer = ref(null)
const enemyData = ref(null)
const isInitialized = ref(false)
const scene = ref(null)

const spawnConstructions = async () => {
    console.log(enemyData.value)
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
