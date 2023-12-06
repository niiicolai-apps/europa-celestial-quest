import PersistentData from './persistent_data.js'
import ConstructionDefinitions from './construction_definitions.js'
import UnitController from './inspect/unit_controller.js'
import { useBank } from './bank.js'
import { useInspect } from './inspect.js'
import { getMesh } from './meshes.js'
import { ref } from 'vue'

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
            mesh: itemDefinition.mesh,
        }

        const canBuild = UnitController.canBuild(item);
        if (canBuild) {
            const queueInterval = setInterval(() => {
                UnitController.dequeueAny(item, scene);
            }, 1000);
            item.userData.queueInterval = queueInterval;
        }

        return item
    }

    const loadState = async () => {
        const data = await PersistentData.get('items')
        console.log('Loaded items', data)
        if (!data) return false
        const inspectManager = useInspect()
        for (const itemData of data) {
            const itemDefinition = ConstructionDefinitions.find(item => item.name === itemData.name)
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
                position: { x: item.position.x, y: item.position.y, z: item.position.z },
                rotation: { x: item.rotation.x, y: item.rotation.y, z: item.rotation.z },
                userData: item.userData,
                uuid: item.uuid,
            }
        })
        PersistentData.set('items', data)
    }

    const removeItemFromState = (item) => {
        let index = -1
        for (let i = 0; i < items.value.length; i++) {
            if (items.value[i].uuid === item.uuid) {
                index = i
                break
            }
        }
        if (index === -1) return false
        console.log('Removing item from state', item)
        items.value.splice(index, 1)
        saveState()
        return true
    }

    const findClosestItem = (position, name) => {
        let closest = null
        let closestDistance = Infinity
        for (const item of items.value) {
            if (item.name !== name) continue
            const distance = item.position.distanceTo(position)
            if (distance < closestDistance) {
                closest = item
                closestDistance = distance
            }
        }
        return closest
    }

    return {
        init,
        spawn,
        canAfford,
        items,
        ConstructionDefinitions,
        saveState,
        removeItemFromState,
        findClosestItem,
    }
}
