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
import UnitsBehavior from '../state_machine/behaviors/units_behavior.json';
import UnitStates from '../state_machine/states/unit_states.js';
import { usePlayers } from '../players/player.js';

const units = ref([]);

const isInitialized = ref(false);
const isPaused = ref(false);

const scene = ref(null);

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
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => {
            isPaused.value = true;
            for (const unit of units.value) {
                unit.object3D.visible = false;
            }
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
            for (const unit of units.value) {
                unit.object3D.visible = true;
            }
        }
    }
})

export const useUnits = () => {

    const featuresToOptions = (features) => {
        const options = {};
        for (const feature of features) {
            options[feature.name] = { ...feature.options };
        }
        return options;
    }

    const createHealth = (unit) => {
        const health = unit.options.health;
        if (!health) return;

        const healthManager = useHealth();
        const current = health.current;
        const maxHealth = health.maxHealth;
        const object3D = unit.object3D;
        const team = unit.team;

        const onDie = () => {
            remove(unit.object3D)
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

    const add = async (object3D, data, team = 'player') => {
        /**
         * Create unit options
         */
        const options = featuresToOptions(data.features);

        /**
         * Create unit data
         */
        const unit = {
            object3D,
            data,
            options,
            team
        };

        /**
         * Create muzzle particle pool.
         */
        if (options.attack?.muzzleParticle) {
            const particlesPools = useParticlesPool();
            if (!particlesPools.findPool(options.attack.muzzleParticle.name)) {
                await particlesPools.create(options.attack.muzzleParticle.name);
            }
        }

        /**
         * Create hit particle pool.
         */
        if (options.attack?.hitParticle) {
            const particlesPools = useParticlesPool();
            if (!particlesPools.findPool(options.attack.hitParticle.name)) {
                await particlesPools.create(options.attack.hitParticle.name);
            }
        }

        /**
         * Hide unit if paused.
         */
        if (isPaused.value) {
            unit.object3D.visible = false;
        }

        /**
         * Add to units array.
         */
        units.value.push(unit);

        /**
         * Add to health manager.
         */
        createHealth(unit);

        /**
         * Add to navigation.
         */
        if (options.move) {
            useNavigation().add(
                object3D, 
                options.move.speed, 
                options.move.acceptableDistance, 
                options.move.groundOffset
            );
        }

        /**
         * Add to state machine.
         */
        const stateMachine = useStateMachine()
        const behavior = UnitsBehavior[data.primary_function]
        const states = UnitStates;
        const id = object3D.uuid
        stateMachine.add(unit, id, behavior, states);

        /**
         * Ensure Unit warrior is set to last command.
         */
        const command = useCommands().findCommand(team);
        if (command && data.primary_function === 'warrior') {
            setStateByFunction('warrior', command.type, team);
        }
    }

    const remove = (object3D) => {
        const unitIndex = units.value.findIndex(u => u.object3D.uuid === object3D.uuid);
        if (unitIndex === -1) return;

        const team = units.value[unitIndex].team;
        
        /**
         * Remove from units array.
         */
        units.value.splice(unitIndex, 1);

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

    const setStateByFunction = (primaryFunction, stateName, team = 'player') => {
        const stateMachine = useStateMachine()
        const unitsByFunction = units.value.filter(u => u.data.primary_function === primaryFunction);
        const unitsByTeam = unitsByFunction.filter(u => u.team === team);
        for (const unit of unitsByTeam) {
            stateMachine.setState(unit.object3D.uuid, stateName);
        }
    }

    const findByName = (name) => {
        return units.value.find(u => u.data.name === name);
    }

    const findAllByTeam = (team) => {
        return units.value.filter(u => u.team === team);
    }

    const findAllNotOnTeam = (team) => {
        return units.value.filter(u => u.team !== team);
    }

    const findClosestNotOnTeam = (team, position) => {
        const notOnTeam = findAllNotOnTeam(team);
        return findClosest(notOnTeam, position);
    }

    const findClosest = (units, position) => {
        let closest = null;
        let closestDistance = Infinity;
        for (const unit of units) {
            const distance = unit.object3D.position.distanceTo(position);
            if (distance < closestDistance) {
                closest = unit;
                closestDistance = distance;
            }
        }
        return { unit: closest, closestDistance };
    }

    const countByName = (name) => {
        return units.value.filter(u => u.data.name === name).length;
    }

    const countByTeam = (team) => {
        return units.value.filter(u => u.team === team).length;
    }

    const countByNameAndTeam = (name, team) => {
        return units.value.filter(u => u.data.name === name && u.team === team).length;
    }

    return {
        units,
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
