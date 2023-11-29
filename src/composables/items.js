import PersistentData from './persistent_data.js'
import { useBank } from './bank.js'
import { useInspect } from './inspect.js'
import { getMesh } from './meshes.js'
import { ref } from 'vue'

const itemDefinitions = [
    {
        name: 'Europa Horizon Drifter X1',
        image: 'thumbnails/human_construction/europa_horizon_drifter_x1.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/europa_horizon_drifter_x1.glb',
            subMeshes: [
                { 
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Bot Facility',
        image: 'thumbnails/human_construction/bot_builder.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/bot_builder.glb',
            subMeshes: [
                { 
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Drone Facility',
        image: 'thumbnails/human_construction/drone_builder.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/drone_builder.glb',
            subMeshes: [
                { 
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Hydrogen Fuel Tank',
        image: 'thumbnails/human_construction/hydrogen_fuel_tank.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/hydrogen_fuel_tank.glb',
            subMeshes: [
                { 
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Rock Metal Extractor',
        image: 'thumbnails/human_construction/rock_metal_extractor.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/rock_metal_extractor.glb',
            subMeshes: [
                { 
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Rover Research Facility',
        image: 'thumbnails/human_construction/rover_research_facility.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/rover_research_facility.glb',
            subMeshes: [
                { 
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Rover Warrior Facility',
        image: 'thumbnails/human_construction/rover_warrior_facility.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/rover_warrior_facility.glb',
            subMeshes: [
                { 
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Machine Gun Turrent',
        image: 'thumbnails/human_construction/machine_gun_turrent.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/machine_gun_turrent.glb',
            subMeshes: [
                { 
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Solar Panel',
        image: 'thumbnails/human_construction/solar_panel.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/solar_panel.glb',
            subMeshes: [
                { 
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [
            {
                name: 'Upgrade 1',
                costs: [
                    { currency: "coins", amount: 1 },
                    { currency: "diamonds", amount: 0 },
                ],
                subMesh: {
                    name: 'Solar_Panel_Level_1',
                },
            },
            {
                name: 'Upgrade 2',
                costs: [
                    { currency: "coins", amount: 1 },
                    { currency: "diamonds", amount: 0 },
                ],
                subMesh: {
                    name: 'Solar_Panel_Level_2',
                },
            },
            {
                name: 'Upgrade 3',
                costs: [
                    { currency: "coins", amount: 1 },
                    { currency: "diamonds", amount: 0 },
                ],
                subMesh: {
                    name: 'Solar_Panel_Level_3',
                },
            },
        ],
    }
]

const items = ref([])
const bankManager = useBank()
const isInitialized = ref(false)
let scene = null

export const useItems = () => {
    const init = async (_scene) => {
        if (isInitialized.value) return false

        scene = _scene
        await loadState()

        isInitialized.value = true
        return true
    }

    const canAfford = (costs) => {
        let canAfford = true
        for (const cost of costs) {
            if (bankManager.getBalance(cost.currency) < cost.amount) {
                canAfford = false
                break
            }
        }
        return canAfford
    }

    const spawn = async (itemDefinition) => {
        const item = await getMesh(itemDefinition.mesh)
        items.value.push(item)
        scene.add(item)
        item.name = itemDefinition.name
        item.userData = {
            isOwned: false,
            costs: itemDefinition.costs,
            upgrade: itemDefinition.upgrade,
            upgrades: itemDefinition.upgrades,
        }
        return item
    }

    const loadState = async () => {
        const data = await PersistentData.get('items')
        console.log('Loaded items', data)
        if (!data) return false
        const inspectManager = useInspect()
        for (const itemData of data) {
            const itemDefinition = itemDefinitions.find(item => item.name === itemData.name)
            if (!itemDefinition) continue

            const item = await spawn(itemDefinition)
            item.position.set(itemData.position.x, itemData.position.y, itemData.position.z)
            item.rotation.set(itemData.rotation.x, itemData.rotation.y, itemData.rotation.z)
            item.userData = itemData.userData
            inspectManager.addSelectable(item)
        }
    }

    const saveState = () => {
        const data = items.value.map(item => {
            return {
                name: item.name,
                position: {x: item.position.x, y: item.position.y, z: item.position.z},
                rotation: {x: item.rotation.x, y: item.rotation.y, z: item.rotation.z},
                userData: item.userData,
            }
        })
        PersistentData.set('items', data)
    }

    return {
        init,
        spawn,
        canAfford,
        items,
        itemDefinitions,
        saveState
    }
}
