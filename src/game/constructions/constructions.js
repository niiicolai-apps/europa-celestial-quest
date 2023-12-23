import PersistentData from '../persistent_data/persistent_data.js'
import ConstructionDefinitions from '../definitions/constructions.js'
import ConstructionStates from '../state_machine/states/construction_states.js'
import ConstructionBehaviors from '../state_machine/behaviors/constructions_behavior.json'
import UnitController from '../inspect/controllers/unit_controller.js'
import { setupUpgradeVisuals, setupConstructionVisuals } from '../../composables/helpers/construction_helper.js'
import { useBank } from '../bank/bank.js'
import { useInspect } from '../inspect/inspect.js'
import { useHealth } from '../health/health.js'
import { useStateMachine } from '../state_machine/state_machine.js'
import { getMesh, removeMesh } from '../models/meshes.js'
import { useGameEnd } from '../managers/game_end.js'
import { useManager } from '../managers/manager.js'
import { useCanvas } from '../../composables/canvas.js';
import { useParticlesPool } from '../particles/particles_pool.js'
import { useCollision } from '../collision/collision.js'
import { ref } from 'vue'
import { usePlayers } from '../players/player.js'

const items = ref([])
const isInitialized = ref(false)
const scene = ref(null)

const recalculateStorage = (team) => {
    const max = { ice: 0, rock: 0, hydrogen: 0, metal: 0, power: 0 }

    const constructions = useItems().findAllByTeam(team);
    
    for (const construction of constructions) {
        const upgradeIndex = construction.userData.upgrade.index;
        const features = construction.userData.upgrades[upgradeIndex].features;
        console.log(features)
        for (const feature of features) {
            if (feature.name !== 'storage') continue
            max[feature.options.type] += feature.options.max
        }
    }

    const bankManager = useBank()
    const bank = bankManager.get(team)
    bank.setMax('ice', max.ice)
    bank.setMax('rock', max.rock)
    bank.setMax('hydrogen', max.hydrogen)
    bank.setMax('metal', max.metal)
    bank.setMax('power', max.power)
    console.log('Recalculating storage', team, max)
}

const removeItemFromState = async (item) => {

    const uuid = item.uuid
    const team = item.userData.team

    /**
     * Remove from the items array.
     */
    let index = -1
    for (let i = 0; i < items.value.length; i++) {
        if (items.value[i].uuid === item.uuid) {
            index = i
            break
        }
    }
    if (index !== -1) {
        items.value.splice(index, 1)
    }

    /**
     * Remove from the state machine.
     */
    useStateMachine().remove(uuid)

    /**
     * Remove from the inspect controller.
     */
    useInspect().removeSelectable(item)

    /**
     * Remove from health manager.
     */
    useHealth().removeHealthObject(item)

    /**
     * Remove from the scene.
     */
    scene.value.remove(item);

    /**
     * Remove from the mesh cache.
     */
    removeMesh(item);  

    /**
     * Recalculate storage.
     */
    recalculateStorage(team)

    /**
     * Remove from the collision system.
     */
    useCollision().remove(item)

    /**
     * Save the player
     */
    await usePlayers().get(team).saveData()
    
    console.log('Removing item from state', item)

    return true
}

const addHealthBar = (item, healthFeature, team, healthBarYOffset) => {
    if (!healthFeature) return
    const { maxHealth, current } = healthFeature.options
    const healthManager = useHealth()

    const onDie = async () => {
        await removeItemFromState(item)
        useGameEnd().endGameCheck()
    }

    const onDamage = (attacker) => {
    }

    healthManager.addHealthObject(
        item,
        team,
        current,
        maxHealth,
        onDie,
        onDamage,
        healthBarYOffset
    )
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('constructions', {
    init: {
        priority: 1,
        callback: async () => {
            if (isInitialized.value) return false
            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            scene.value = adapter.scene
            isInitialized.value = true;
        }
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => {
            for (const construction of items.value) {
                console.log('Hiding construction', construction)
                construction.visible = false
            }
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
            for (const construction of items.value) {
                construction.visible = true
            }
        }
    }
})

export const useItems = () => {

    const canAfford = (costs) => {
        let canAfford = true
        const bankManager = useBank()
        for (const cost of costs) {
            if (bankManager.getBalance(cost.currency) < cost.amount) {
                canAfford = false
                break
            }
        }
        return canAfford
    }

    const spawn = async (itemDefinition, team = 'player', isOwned = false, upgradeIndex = 0) => {
        const { mesh, name, type, costs, upgrades, placementYOffset } = itemDefinition
        
        const upgrade = { index: upgradeIndex }
        const item = await getMesh(mesh)
        
        item.name = name
        item.userData = {
            mesh,
            type,
            costs,
            upgrades,
            upgrade,
            isOwned,
            placementYOffset,
            team
        }

        scene.value.add(item)
        items.value.push(item)
        setupUpgradeVisuals(item)

        if (itemDefinition.excludeSubMeshes) {
            setupConstructionVisuals(item, [], itemDefinition.excludeSubMeshes)
        }

        const produceFeature = itemDefinition.upgrades[0]?.features?.find(feature => feature.name === 'produce')
        const attackFeature = itemDefinition.upgrades[0]?.features?.find(feature => feature.name === 'attack')
        const healthFeature = itemDefinition.upgrades[0]?.features?.find(feature => feature.name === 'health')
        const storageFeature = itemDefinition.upgrades[0]?.features?.find(feature => feature.name === 'storage')

        const canProduce = produceFeature !== undefined
        const canAttack = attackFeature !== undefined
        const canStore = storageFeature !== undefined
        const canBuild = UnitController.canBuild(item);
        
        const healthBarYOffset = itemDefinition.healthBarYOffset || 0
        addHealthBar(item, healthFeature, team, healthBarYOffset)
        console.log(attackFeature)
        if (attackFeature && attackFeature.options.muzzleParticle) {
            const particlesPools = useParticlesPool();
            if (!particlesPools.findPool(attackFeature.options.muzzleParticle.name)) {
                await particlesPools.create(attackFeature.options.muzzleParticle.name);
            }   
        }

        if (attackFeature && attackFeature.options.hitParticle) {
            const particlesPools = useParticlesPool();
            if (!particlesPools.findPool(attackFeature.options.hitParticle.name)) {
                await particlesPools.create(attackFeature.options.hitParticle.name);
            }   
        }

        const stateMachine = useStateMachine()
        const behavior = ConstructionBehaviors[itemDefinition.primary_function]
        const states = ConstructionStates;
        const object = { construction: item, canBuild, canStore, canProduce, canAttack, team }
        const id = item.uuid
        stateMachine.add(object, id, behavior, states);

        if (canStore) {
            recalculateStorage(team)
        }

        useCollision().add(item)

        return item
    }

    const dequeueAny = async (item) => {
        await UnitController.dequeueAny(item, scene.value)
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

    const findClosestByNameAndTeam = (position, name, team) => {
        let closest = null
        let closestDistance = Infinity
        for (const item of items.value) {
            if (item.name !== name) continue
            if (item.userData.team !== team) continue
            const distance = item.position.distanceTo(position)
            if (distance < closestDistance) {
                closest = item
                closestDistance = distance
            }
        }
        return closest
    }

    const findClosestNotOnTeam = (position, team) => {
        let closest = null
        let closestDistance = Infinity
        for (const item of items.value) {
            if (item.userData.team === team) continue
            const distance = item.position.distanceTo(position)
            if (distance < closestDistance) {
                closest = item
                closestDistance = distance
            }
        }
        return closest
    }

    const findByNameAndTeam = (name, team) => {
        return items.value.find(item => {
            return item.name === name && item.userData.team === team
        })
    }

    const findByNameAndUpgradeAndTeam = (name, upgradeIndex, team) => {
        return items.value.find(item => {
            return item.name === name && item.userData.upgrade.index === upgradeIndex && item.userData.team === team
        })
    }

    const findAllByNameAndTeam = (name, team) => {
        return items.value.filter(item => {
            return item.name === name && item.userData.team === team
        })
    }

    const findAllByTeam = (team) => {
        return items.value.filter(item => {
            return item.userData.team === team
        })
    }

    const findAllNotOnTeam = (team) => {
        return items.value.filter(item => {
            return item.userData.team !== team
        })
    }

    const countByNameAndTeam = (name, team) => {
        return items.value.filter(item => {
            return item.name === name && item.userData.team === team
        }).length
    }

    const countByNameAndTeamAndUpgrade = (name, team, upgradeIndex) => {
        return items.value.filter(item => {
            return item.name === name && item.userData.team === team && item.userData.upgrade.index === upgradeIndex
        }).length
    }

    const countByTeam = (team) => {
        return items.value.filter(item => item.userData.team === team).length
    }

    return {
        spawn,
        canAfford,
        items,
        ConstructionDefinitions,
        dequeueAny,
        removeItemFromState,
        recalculateStorage,
        findAllByNameAndTeam,
        findAllByTeam,
        findAllNotOnTeam,
        findClosestNotOnTeam,
        findClosestItem,
        findClosestByNameAndTeam,
        findByNameAndTeam,
        findByNameAndUpgradeAndTeam,
        countByTeam,
        countByNameAndTeam,
        countByNameAndTeamAndUpgrade
    }
}
