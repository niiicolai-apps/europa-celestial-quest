import { useBank } from './bank.js'
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
    const init = (_scene) => {
        if (isInitialized.value) return false

        scene = _scene

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

    return {
        init,
        spawn,
        canAfford,
        items,
        itemDefinitions,
    }
}
