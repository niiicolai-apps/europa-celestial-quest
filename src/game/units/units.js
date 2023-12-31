import { ref } from 'vue';

import { useHealth } from '../health/health.js';
import { removeMesh } from '../models/meshes.js';
import { useStateMachine } from '../state_machine/state_machine.js'
import { useGameEnd } from '../managers/game_end.js'
import { useManager } from '../managers/manager.js';
import { useCanvas } from '../../composables/canvas.js';
import { useParticlesPool } from '../particles/particles_pool.js';
import { useCommands } from './commands.js';
import { useNavigation } from '../navigation/navigation.js';
import { usePlayers } from '../players/player.js';

import UnitController from './unit_controller.js';
import UnitsBehavior from '../state_machine/behaviors/units_behavior.json';
import UnitStates from '../state_machine/states/unit_states.js';

const isInitialized = ref(false);
const scene = ref(null);

const setupHealth = (unit) => {
    const health = unit.features.health;
    if (!health) return;

    const healthManager = useHealth();
    const current = health.current;
    const maxHealth = health.maxHealth;
    const object3D = unit.object3D;
    const team = unit.team;

    const onDie = () => {
        useUnits().remove(unit.object3D)
        useGameEnd().endGameCheck()
    }

    const onDamage = (attacker) => {
        const behavior = UnitsBehavior[unit.data.primary_function];
        const { state: reactStateName, blocking_states } = behavior.on_damage;
        if (blocking_states.includes(unit.state?.name)) {
            return;
        }

        const state = behavior.states.find(s => s.name === reactStateName);
        if (!state) {
            throw new Error(`State not found: ${reactStateName}`);
        }

        useStateMachine().setState(unit.object3D.uuid, reactStateName, attacker);
    }

    healthManager.addHealthObject(
        object3D,
        team,
        current,
        maxHealth,
        onDie,
        onDamage
    )
}

const setup = async (unit) => {
    const object3D = unit.object3D;
    const unitDefinition = unit.data;
    const team = unit.team;
    const move = unit.features.move;
    const attack = unit.features.attack;

    /**
     * Add to scene.
     */
    scene.value.add(object3D);

    /**
     * Create muzzle particle pool.
     */
    if (attack?.muzzleParticle) {
        const particlesPools = useParticlesPool();

        if (!particlesPools.findPool(attack.muzzleParticle.name)) {
            await particlesPools.create(attack.muzzleParticle.name);
        }
    }

    /**
     * Create hit particle pool.
     */
    if (attack?.hitParticle) {
        const particlesPools = useParticlesPool();

        if (!particlesPools.findPool(attack.hitParticle.name)) {
            await particlesPools.create(attack.hitParticle.name);
        }
    }

    /**
     * Add to health manager.
     */
    setupHealth(unit);

    /**
     * Add to navigation.
     */
    if (move) {
        useNavigation().add(
            object3D,
            move.speed,
            move.acceptableDistance,
            move.groundOffset
        );
    }

    /**
     * Add to state machine.
     */
    useStateMachine().add(
        unit,
        object3D.uuid,
        UnitsBehavior[unitDefinition.primary_function],
        UnitStates
    );

    /**
     * Ensure Unit warrior is set to last command.
     */
    const command = useCommands().findCommand(team);
    if (command && unitDefinition.primary_function === 'warrior') {
        useUnits().setStateByFunction('warrior', command.type, team);
    }
}

const destroy = (unit) => {
    const object3D = unit.object3D;
    const team = unit.team;

    /**
     * Remove from state machine.
     */
    useStateMachine().remove(object3D.uuid);

    /**
     * Remove from health manager.
     */
    useHealth().removeHealthObject(object3D);

    /**
     * Remove from navigation.
     */
    useNavigation().remove(object3D);

    /**
     * Remove from scene.
     */
    scene.value.remove(object3D)

    /**
     * Remove from cache.
     */
    removeMesh(object3D)

    /**
     * Save player data.
     */
    usePlayers().get(team).saveData()
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('units', {
    init: {
        priority: 1,
        callback: async (options) => {
            if (isInitialized.value) return false

            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            scene.value = adapter.scene

            isInitialized.value = true;
        }
    }
})

export const useUnits = () => {

    const add = async (object3D, unitDefinition, team = 'player') => {
        const unit = UnitController.create(object3D, unitDefinition, team);
        await setup(unit);
        return unit;
    }

    const remove = (object3D) => {
        const unit = findByObject3D(object3D);
        if (!unit) return;
        UnitController.remove(object3D);
        destroy(unit);
    }

    const setStateByFunction = (primaryFunction, stateName, team = 'player') => {
        const stateMachine = useStateMachine()
        const units = UnitController.findAllByTeam(team).filter(u => u.data.primary_function === primaryFunction);
        console.log(units, stateName, team);
        for (const unit of units) {
            stateMachine.setState(unit.object3D.uuid, stateName);
        }
    }

    const findByName = (name) => {
        return UnitController.findByName(name);
    }

    const findAllByTeam = (team) => {
        return UnitController.findAllByTeam(team);
    }

    const findAllNotOnTeam = (team) => {
        return UnitController.findAllNotOnTeam(team);
    }

    const findClosestNotOnTeam = (team, position) => {
        return UnitController.findClosestNotOnTeam(team, position);
    }

    const findClosest = (units, position) => {
        return UnitController.findClosest(units, position);
    }

    const countByName = (name) => {
        return UnitController.countByName(name);
    }

    const countByTeam = (team) => {
        return UnitController.countByTeam(team);
    }

    const countByNameAndTeam = (name, team) => {
        return UnitController.countByNameAndTeam(name, team);
    }

    return {
        add,
        remove,
        setStateByFunction,
        findByName,
        findAllByTeam,
        findAllNotOnTeam,
        findClosestNotOnTeam,
        findClosest,
        countByName,
        countByNameAndTeam,
        countByTeam
    }
}
