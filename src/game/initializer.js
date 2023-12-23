import { useMap } from './map/map.js'
import { usePlayers } from './players/player.js'
import { useManager } from './managers/manager.js'
import { useCanvas } from '../composables/canvas.js'
import { useItems } from './constructions/constructions.js'
import { useCommands } from './units/commands.js'
import UNITS from './definitions/units.js';
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
        const mesh = await player.spawnConstruction(construction.name, true, upgradeIndex, true)
        mesh.position.x = construction.position.x
        mesh.position.y = construction.position.y
        mesh.position.z = construction.position.z
        mesh.rotation.x = construction.rotation.x * Math.PI / 180
        mesh.rotation.y = construction.rotation.y * Math.PI / 180
        mesh.rotation.z = construction.rotation.z * Math.PI / 180
        scene.value.add(mesh)
    }

    if (data.units) {
        for (const unit of data.units) {
            const unitData = Object.values(UNITS).find(u => u.name === unit.name);
            const mesh = await player.spawnUnit(unitData, true)
            mesh.position.x = unit.position.x
            mesh.position.y = unit.position.y
            mesh.position.z = unit.position.z
            mesh.rotation.x = unit.rotation.x * Math.PI / 180
            mesh.rotation.y = unit.rotation.y * Math.PI / 180
            mesh.rotation.z = unit.rotation.z * Math.PI / 180
            scene.value.add(mesh)
        }
    }
    
    const items = useItems().findAllByTeam(player.team)
    if (items.length === 0) return

    const startConstruction = items[0]

    /**
     * Setup player camera.
     */
    if (player.isYou) {
        await Camera.setPosition(startConstruction.position);
    }

    /**
     * Setup player command.
     */
    const commands = useCommands()
    const commandZOffset = -15
    const position = { x: startConstruction.position.x, y: startConstruction.position.y, z: startConstruction.position.z + commandZOffset}
    commands.setCommand(commands.COMMAND_TYPES.REGROUP, position, player.team)

    if (player.isYou) {
        commands.PositionTracker().setMarkerPosition(position)
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
            playersMapData.value = await map.players()
            
            /**
             * 1. Load PD players
             */
            const pdPlayers = await PersistentData.getPlayers();
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
            
            isInitialized.value = true;
        }
    }
})

export const useInitializer = () => {


    return {
    }
}
