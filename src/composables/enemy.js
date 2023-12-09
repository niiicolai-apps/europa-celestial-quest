import { getMesh } from './meshes.js'
import { useMap } from './map.js'
import { useItems } from './constructions.js'
import { useUnits } from './units.js'
import { useNavigation } from './navigation.js'
import { ref } from 'vue'
import ConstructionDefinitions from './definitions/constructions.js'
import MeshesJson from '../meshes/meshes.json'

const navigation = useNavigation()
const isInitialized = ref(false)
const armyIsSpawned = ref(false)
const armyCommand = ref({ type: 'idle' })
const spawnInterval = ref(null)
const constructions = ref([])
const scene = ref(null)

const spawnUnits = async () => {
    if (armyIsSpawned.value) return

    let allUnitsSpawned = true
    const unitsManager = useUnits()
    for (const construction of constructions.value) {
        if (construction.spawn) {
            const { point, units } = construction.spawn

            for (const unitData of units) {
                
                if (unitData.instances.length >= unitData.count) {
                    continue
                }

                const mesh = await getMesh(MeshesJson[unitData.name])
                if (!mesh) {
                    console.error(`Mesh not found: ${unitData.name}`)
                    continue
                }

                mesh.position.x = point.x + (unitData.instances.length + 1);
                mesh.position.y = point.y;
                mesh.position.z = point.z;
                mesh.rotation.x = 0;
                mesh.rotation.y = 0;
                mesh.rotation.z = 0;
                scene.value.add(mesh)
                unitData.instances.push(mesh)
                unitsManager.add(mesh, unitData.spawnData, 'enemy')
                allUnitsSpawned = false                
            }
        }
    }

    armyIsSpawned.value = allUnitsSpawned
}

const spawnConstructions = async () => {
    const map = useMap()
    const items = useItems()
    const { constructions: c } = map.map.value.enemy

    for (const construction of c) {

        const definition = Object.values(ConstructionDefinitions).find(d => d.name === construction.name)
        if (!definition) {
            console.error(`Construction definition not found: ${construction.name}`)
            continue
        }
        const mesh = await items.spawn(definition, 'enemy')
        mesh.position.x = construction.position.x
        mesh.position.y = construction.position.y
        mesh.position.z = construction.position.z
        mesh.rotation.x = construction.rotation.x * Math.PI / 180
        mesh.rotation.y = construction.rotation.y * Math.PI / 180
        mesh.rotation.z = construction.rotation.z * Math.PI / 180
        scene.value.add(mesh)
        
        const data = { mesh }
        if (construction.spawn) {
            data.spawn = construction.spawn
            for (const unitData of data.spawn.units) {
                unitData.instances = []
                for (const upgrade of definition.upgrades) {
                    const unit = upgrade.units.find(u => u.name === unitData.name)
                    if (unit) {
                        unitData.spawnData = unit
                        break
                    }
                }
                if (!unitData.spawnData) {
                    console.error(`Spawn data not found for ${unitData.name}`)
                }
            }
        }
        
        constructions.value.push(data)
    }
}

const unitsBehaviour = () => {
    if (!armyIsSpawned.value) {
        spawnUnits()
        return
    }

    if (armyCommand.value.type !== 'attack') {
        armyCommand.value.type = 'attack'
        useUnits().setCommand('attack', { "x": 246, "y": 20, "z": -423 }, 'enemy');
        useUnits().setStateByFunction('warrior', 'attack', 'enemy')
        console.log('Attack!')
    }
}

export const useEnemy = () => {

    const init = async (_scene) => {
        if (isInitialized.value) return

        scene.value = _scene
        isInitialized.value = true
        await spawnConstructions()
    }

    const enable = () => {
        const map = useMap()
        const { spawn_every } = map.map.value.enemy
        spawnInterval.value = setInterval(unitsBehaviour, spawn_every);
    }

    const disable = () => {
        clearInterval(spawnInterval.value)
    }

    return {
        init,
        enable,
        disable,
        constructions
    }
}
