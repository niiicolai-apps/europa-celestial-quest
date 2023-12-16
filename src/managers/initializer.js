import { useMap } from './map.js'
import { usePlayers } from './player.js'
import { useManager } from './manager.js'
import { useCanvas } from '../composables/canvas.js'
import PersistentData from '../composables/persistent_data.js'
import { ref } from 'vue'

const players = usePlayers()

const enemyPlayer = ref(null)
const humanPlayer = ref(null)

const playersMapData = ref(null)
const playerInstances = ref([])

const isInitialized = ref(false)
const scene = ref(null)

const setup = async (player, data) => {

    for (const construction of data.constructions) {
        const mesh = await player.spawnConstruction(construction.name)
        mesh.position.x = construction.position.x
        mesh.position.y = construction.position.y
        mesh.position.z = construction.position.z
        mesh.rotation.x = construction.rotation.x * Math.PI / 180
        mesh.rotation.y = construction.rotation.y * Math.PI / 180
        mesh.rotation.z = construction.rotation.z * Math.PI / 180
        scene.value.add(mesh)
        console.log('spawned construction', mesh, scene.value)
    }
}

/**
 * Manager methods.
 * Will be called by the manager.
 */ 
useManager().create('initializer', {
    init: {
        priority: 1,
        callback: async () => {
            if (isInitialized.value) return false

            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            scene.value = adapter.scene

            const map = useMap()
            const mapName = await map.name()
            playersMapData.value = await map.players()

            /**
             * 1. Load PD players
             */
            const pdPlayers = await PersistentData.get(`${mapName}-players`)
            const spawnedTeams = []
            if (pdPlayers) {
                for (const pdPlayer of pdPlayers) {
                    const player = players.add(
                        pdPlayer.is_computer, 
                        pdPlayer.is_you, 
                        pdPlayer.team_name, 
                        pdPlayer.difficulty
                    )

                    spawnedTeams.push(pdPlayer.team_name)
                    playerInstances.value.push(player)
                    await setup(player, pdPlayer)
                }
            }
            
            /**
             * 2. Load map players
             */
            for (const mapPlayer of playersMapData.value) {
                const exists = spawnedTeams.includes(mapPlayer.team_name)
                if (exists) continue

                const player = players.add(
                    mapPlayer.is_computer, 
                    mapPlayer.is_you, 
                    mapPlayer.team_name, 
                    mapPlayer.difficulty
                )
                
                playerInstances.value.push(player)
                await setup(player, mapPlayer)
            }
            
            isInitialized.value = true;
        }
    }
})

export const useInitializer = () => {


    return {
    }
}
