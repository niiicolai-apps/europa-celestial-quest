import { useMap } from './map/map.js'
import { usePlayers } from './players/player.js'
import { useManager } from './managers/manager.js'
import { useCanvas } from '../composables/canvas.js'
import { useItems } from './constructions/constructions.js'
import { useCommands } from './units/commands.js'
import Camera from './camera/camera.js'
import PersistentData from './persistent_data/persistent_data.js'
import { ref } from 'vue'

const players = usePlayers()
const playersMapData = ref(null)
const playerInstances = ref([])

const isInitialized = ref(false)
const scene = ref(null)

const setup = async (player, data) => {

    for (const construction of data.constructions) {
        const upgradeIndex = construction.upgradeIndex || 0
        const mesh = await player.spawnConstruction(construction.name, true, upgradeIndex)
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
                    const player = await players.add(
                        pdPlayer.is_computer, 
                        pdPlayer.is_you, 
                        pdPlayer.team_name, 
                        pdPlayer.difficulty,
                        pdPlayer.level,
                        pdPlayer.experience,
                        pdPlayer.bankAccounts
                    )

                    spawnedTeams.push(pdPlayer.team_name)
                    playerInstances.value.push(player)
                    await setup(player, pdPlayer)
                }
            }
            
            /**
             * 2. Load map players
             */
            const startLevel = 1
            const startExperience = 0
            for (const mapPlayer of playersMapData.value) {
                const exists = spawnedTeams.includes(mapPlayer.team_name)
                if (exists) continue
                
                const player = await players.add(
                    mapPlayer.is_computer, 
                    mapPlayer.is_you, 
                    mapPlayer.team_name, 
                    mapPlayer.difficulty,
                    startLevel,
                    startExperience,
                    mapPlayer.bankAccounts
                )
                
                playerInstances.value.push(player)
                await setup(player, mapPlayer)
            }

            /**
             * Find player (you)
             */
            const you = players.findYou()
            const ehdx1 = useItems().findByNameAndTeam('Europa Horizon Drifter X1', you.team)

            /**
             * Setup player camera.
             */
            await Camera.manager.setPosition(ehdx1.position.x, ehdx1.position.z + 150);
            await Camera.manager.setZoom(250)

            /**
             * Setup player command.
             */
            const commands = useCommands()
            const commandZOffset = -15
            const position = { x: ehdx1.position.x, y: ehdx1.position.y, z: ehdx1.position.z + commandZOffset}
            commands.setCommand(commands.COMMAND_TYPES.REGROUP, position, you.team)
            commands.PositionTracker().setMarkerPosition(position)
            
            isInitialized.value = true;
        }
    }
})

export const useInitializer = () => {


    return {
    }
}
