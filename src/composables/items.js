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
let queueInterval = null

const recalculateStorage = () => {
    let ice = 0, rock = 0, hydrogen = 0, metal = 0, power = 0;
    for (const item of items.value) {
        if (!item.userData.canStore) continue

        const features = item.userData.upgrades[item.userData.upgrade.index].features;
        for (const feature of features) {
            if (feature.name !== 'storage') continue
            if (feature.options.type === 'ice') {
                ice += feature.options.max;
            } else if (feature.options.type === 'rock') {
                rock += feature.options.max;
            } else if (feature.options.type === 'hydrogen') {
                hydrogen += feature.options.max;
            } else if (feature.options.type === 'metal') {
                metal += feature.options.max;
            } else if (feature.options.type === 'power') {
                power += feature.options.max;
            }
        }
    }

    bankManager.updateCurrencyMax('ice', ice);
    bankManager.updateCurrencyMax('rock', rock);
    bankManager.updateCurrencyMax('hydrogen', hydrogen);
    bankManager.updateCurrencyMax('metal', metal);
    bankManager.updateCurrencyMax('power', power);
    bankManager.overrideBalance(power + bankManager.getCurrency('power').defaultMax, 'power');
}

export const useItems = () => {
    const init = async (_scene) => {
        if (isInitialized.value) return false

        scene = _scene
        await loadState()

        queueInterval = setInterval(() => {
            const time = Date.now()

            for (const item of items.value) {

                if (item.userData.canBuild) {
                    UnitController.dequeueAny(item, scene)
                }

                else if (item.userData.canProduce) {
                    const produceFeature = item.userData.upgrades[item.userData.upgrade.index]
                        .features.find(feature => feature.name === 'produce')
                    const currency = produceFeature.options.type
                    const isFull = bankManager.getBalance(currency) >= bankManager.getCurrency(currency).max
                    
                    if (!isFull && produceFeature.options.nextTime < time) {
                        const canAfford = bankManager.canAfford(produceFeature.options.costs)
                        if (!canAfford) continue

                        const amount = produceFeature.options.rate
                        bankManager.deposit(amount, currency)
                        for (const cost of produceFeature.options.costs) {
                            bankManager.withdraw(cost.amount, cost.currency)
                        }
                        produceFeature.options.nextTime = time + produceFeature.options.speed
                    }
                }
            }
        }, 15000);

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

    const spawn = async (itemDefinition, team = 'player') => {
        const item = await getMesh(itemDefinition.mesh)
        items.value.push(item)
        scene.add(item)
        item.name = itemDefinition.name
        item.userData = {
            isOwned: false,
            costs: itemDefinition.costs,
            upgrade: { index: 0 },
            upgrades: itemDefinition.upgrades,
            mesh: itemDefinition.mesh,
            team,
        }

        item.userData.canBuild = UnitController.canBuild(item);
        item.userData.canStore = itemDefinition
            .upgrades
            .find(upgrade => {
                if (!upgrade.features) return false
                return upgrade.features.find(feature => feature.name === 'storage')
            }) !== undefined

        const produceFeature = itemDefinition.upgrades[0]?.features?.find(feature => feature.name === 'produce')
        item.userData.canProduce = produceFeature !== undefined

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
            item.userData.upgrade.index = itemData.userData.upgrade.index
            item.userData.isOwned = itemData.userData.isOwned
            inspectManager.addSelectable(item)
            recalculateStorage()
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

    const findItemByName = (name) => {
        return items.value.find(item => item.name === name)
    }

    const findItemByNameAndUpgrade = (name, upgradeIndex) => {
        return items.value.find(item => {
            return item.name === name && item.userData.upgrade.index === upgradeIndex
        })
    }

    const countItemsByName = (name) => {
        return items.value.filter(item => item.name === name).length
    }

    const countItemsByNameAndUpgrade = (name, upgradeIndex) => {
        return items.value.filter(item => {
            return item.name === name && item.userData.upgrade.index === upgradeIndex
        }).length
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
        recalculateStorage,
        findItemByName,
        findItemByNameAndUpgrade,
        countItemsByName,
        countItemsByNameAndUpgrade,
    }
}
