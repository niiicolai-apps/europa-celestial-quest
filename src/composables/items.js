import PersistentData from './persistent_data.js'
import { useBank } from './bank.js'
import { useInspect } from './inspect.js'
import { getMesh } from './meshes.js'
import { ref } from 'vue'

const itemDefinitions = [
    {
        name: 'Item 1',
        image: 'item1.png',
        requiredLevel: 1,
        mesh: {
            type: 'BoxGeometry',
            subMeshes: [
                { 
                    name: 'Cube',
                    texturePack: 'default',
                    width: 5,
                    height: 5,
                    depth: 5,
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
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
