
import { ref } from 'vue'
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
import { usePlayers } from '../players/player.js'

import PersistentData from '../persistent_data/persistent_data.js'
import ConstructionController from './construction_controller.js'
import ConstructionDefinitions from '../definitions/constructions.js'
import ConstructionStates from '../state_machine/states/construction_states.js'
import ConstructionBehaviors from '../state_machine/behaviors/constructions_behavior.json'
import UnitController from '../inspect/controllers/unit_controller.js'

const isInitialized = ref(false)
const scene = ref(null)

const recalculateStorage = (team) => {
    const max = { ice: 0, rock: 0, hydrogen: 0, metal: 0, power: 0 }

    const constructions = useItems().findAllByTeam(team);
    
    for (const construction of constructions) {
        const upgrade = construction.getUpgrade();
        const features = upgrade.features;
        
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
}

const addHealthBar = (item, healthFeature, team, healthBarYOffset, currentHealth=null) => {
    if (!healthFeature) return

    const { maxHealth } = healthFeature
    const healthManager = useHealth()

    const onDie = async () => {
        await useItems().removeItemFromState(item)
        useGameEnd().endGameCheck()
    }

    const onDamage = (attacker) => {
    }

    if (!currentHealth) {
        currentHealth = maxHealth
    }

    healthManager.addHealthObject(
        item,
        team,
        currentHealth,
        maxHealth,
        onDie,
        onDamage,
        healthBarYOffset
    )
}

const setup = async (construction, currentHealth=null) => {
    const object3D = construction.object3D
    const definition = construction.definition
    const team = construction.team
    const features = construction.features

    /**
     * Set the name.
     */
    object3D.name = definition.name

    /**
     * Add to scene.
     */
    scene.value.add(object3D)

    /**
     * Setup health bar.
     */
    const healthBarYOffset = definition.healthBarYOffset || 0
    addHealthBar(object3D, features.health, team, healthBarYOffset, currentHealth)

    /**
     * Setup particles.
     */
    const attackFeature = features.attack
    if (attackFeature) {
        const particlesPools = useParticlesPool();

        if (attackFeature.muzzleParticle && !particlesPools.findPool(attackFeature.muzzleParticle.name)) {
            await particlesPools.create(attackFeature.muzzleParticle.name);
        }   

        if (attackFeature.hitParticle && !particlesPools.findPool(attackFeature.hitParticle.name)) {
            await particlesPools.create(attackFeature.hitParticle.name);
        }  
    }

    /**
     * Setup the state machine.
     */
    useStateMachine().add(
        construction, 
        object3D.uuid, 
        ConstructionBehaviors[definition.primary_function], 
        ConstructionStates
    );

    /**
     * Setup the storage.
     */
    if (features.storage) {
        recalculateStorage(team)
    }

    /**
     * Add to the collision system.
     */
    useCollision().add(object3D)

    /**
     * Ensure the construction are selectable.
     */
    useInspect().addSelectable(object3D)
}

const destroy = async (construction) => {
    const object3D = construction.object3D
    const uuid = object3D.uuid
    const team = construction.team

    /**
     * Remove from the scene.
     */
    scene.value.remove(object3D);

    /**
     * Remove from the state machine.
     */
    useStateMachine().remove(uuid)

    /**
     * Remove from the inspect controller.
     */
    useInspect().removeSelectable(object3D)

    /**
     * Remove from health manager.
     */
    useHealth().removeHealthObject(object3D)

    /**
     * Remove from the mesh cache.
     */
    removeMesh(object3D);  

    /**
     * Recalculate storage.
     */
    recalculateStorage(team)

    /**
     * Remove from the collision system.
     */
    useCollision().remove(object3D)

    /**
     * Save the player
     */
    await usePlayers().get(team).saveData()
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
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
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

    const spawn = async (constructionDefinition, team = 'player', isOwned = false, upgradeIndex = 0, currentHealth=null) => {
        const object3D = await getMesh(constructionDefinition.mesh)
        const construction = ConstructionController.create(object3D, constructionDefinition, team, isOwned, upgradeIndex)
        await setup(construction, currentHealth)
        return construction
    }

    const removeItemFromState = async (object3D) => {
        const construction = ConstructionController.findByObject3D(object3D)
        if (!construction) return false
        ConstructionController.remove(object3D)
        await destroy(construction)
        return true
    }

    const dequeueAny = async (object3D) => {
        await UnitController.dequeueAny(object3D, scene.value)
    }

    const findByObject3D = (object3D) => {
        return ConstructionController.findByObject3D(object3D)
    }

    const findClosestByNameAndTeam = (position, name, team) => {
        return ConstructionController.findClosestByNameAndTeam(position, name, team)
    }

    const findClosestNotOnTeam = (position, team) => {
        return ConstructionController.findClosestNotOnTeam(position, team)
    }

    const findByNameAndTeam = (name, team) => {
        return ConstructionController.findByNameAndTeam(name, team)
    }

    const findByNameAndUpgradeAndTeam = (name, upgradeIndex, team) => {
        return ConstructionController.findByNameAndUpgradeAndTeam(name, upgradeIndex, team)
    }

    const findAllByNameAndTeam = (name, team) => {
        return ConstructionController.findAllByNameAndTeam(name, team)
    }

    const findAllByTeam = (team) => {
        return ConstructionController.findAllByTeam(team)
    }

    const findAllNotOnTeam = (team) => {
        return ConstructionController.findAllNotOnTeam(team)
    }

    const countByNameAndTeam = (name, team) => {
        return ConstructionController.countByNameAndTeam(name, team)
    }

    const countByNameAndTeamAndUpgrade = (name, team, upgradeIndex) => {
        return ConstructionController.countByNameAndUpgradeAndTeam(name, upgradeIndex, team)
    }

    const countByTeam = (team) => {
        return ConstructionController.countByTeam(team)
    }

    return {
        spawn,
        canAfford,
        ConstructionDefinitions,
        dequeueAny,
        removeItemFromState,
        recalculateStorage,
        findAllByNameAndTeam,
        findAllByTeam,
        findAllNotOnTeam,
        findClosestNotOnTeam,
        findClosestByNameAndTeam,
        findByNameAndTeam,
        findByObject3D,
        findByNameAndUpgradeAndTeam,
        countByTeam,
        countByNameAndTeam,
        countByNameAndTeamAndUpgrade
    }
}
