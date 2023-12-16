import { ref } from 'vue';
import { useGround } from './ground.js';
import { useHealth } from '../composables/health.js';
import { removeMesh } from '../composables/meshes.js';
import { useStateMachine } from './state_machine.js'
import { useHeightMap } from '../composables/height_map.js';
import { useToast } from '../composables/toast.js';
import { useGameEnd } from '../composables/game_end.js'
import { useManager } from './manager.js';
import { useCanvas } from '../composables/canvas.js';
import { useParticles } from './particles.js';
import * as THREE from 'three';
import UnitsBehavior from './behaviors/units_behavior.json';
import UnitStates from './states/unit_states.js';

const ground = useGround();
const heightMap = useHeightMap();
const units = ref([]);
const scene = ref(null);
const isInitialized = ref(false);
const isPaused = ref(false);

const domElement = ref(null);
const commands = ref([
    { 
        team: 'player', 
        type: 'regroup', 
        position: { x: 0, y: 0, z: 0 } 
    }
]);

const isSettingWarriorCommand = ref(false);
const WARRIOR_COMMANDS = ['regroup', 'attack'];

const warriorMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const warriorMarkerGeometry = new THREE.BoxGeometry(1, 1, 1);
const warriorMarkerMesh = new THREE.Mesh(warriorMarkerGeometry, warriorMarkerMaterial);

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
            domElement.value = adapter.renderer.domElement
            scene.value = adapter.scene
            scene.value.add(warriorMarkerMesh);
            warriorMarkerMesh.visible = false;
            
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
            options[feature.name] = {...feature.options};
        }
        return options;
    }

    const createCommand = (team) => {
        let command = commands.value.find(c => c.team === team);
        if (!command) {
            command = { team, type: 'regroup', position: { x: 0, y: 0, z: 0 } };
            commands.value.push(command);
        }
        return command;
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
            scene.value.remove(unit.object3D)
            removeMesh(unit.object3D)
            useGameEnd().endGameCheck()
        }

        const onDamage = (attacker) => {
            /*
                    const behavior = UnitsBehavior[unit.data.primary_function];
                    const { state: reactStateName, blocking_states } = behavior.on_damage;
                    if (blocking_states.includes(unit.state?.name)) {
                        return;
                    }

                    const state = behavior.states.find(s => s.name === reactStateName);
                    if (!state) {
                        throw new Error(`State not found: ${reactStateName}`);
                    }

                    console.log(attacker)
                    unit.state = state;
                    unit.target = attacker;
                    setAction(unit, 0);*/
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

    const add = (object3D, data, team = 'player') => {
        // Create unit options
        const options = featuresToOptions(data.features);
        const command = createCommand(team);

        // Create unit
        const unit = {
            object3D,
            data,
            options,
            command,
            team
        };

        if (options.attack?.muzzleParticle) {
            console.log('loading muzzle particle', options.attack.muzzleParticle)
            unit.muzzleParticle = useParticles().load(`${object3D.uuid}-muzzle`, options.attack.muzzleParticle.name);           
        }

        if (options.attack?.hitParticle) {
            unit.hitParticle = useParticles().load(`${object3D.uuid}-hit`, options.attack.hitParticle.name);           
        }

        if (isPaused.value) {
            unit.object3D.visible = false;
        }
        
        units.value.push(unit);
        createHealth(unit);

        const stateMachine = useStateMachine()
        const behavior = UnitsBehavior[data.primary_function]
        const states = UnitStates;
        const id = object3D.uuid
        stateMachine.add(unit, id, behavior, states);
    }

    const remove = (object3D) => {
        units.value = units.value.filter(u => u.object3D.uuid !== object3D.uuid);
    }

    const onPointerDown = (event) => {
        const point = ground.getIntersectionFromMouse(event);
        if (!point) return;

        const command = commands.value.find(c => c.team === 'player');
        command.position = point;
        //command.position.y = heightMap.getY(point.x, point.z);
        warriorMarkerMesh.position.copy(point);
        useToast().add(`toasts.units.set_warrior_command.${command.type}`, 4000, 'info');
        stopTrackWarriorCommand();
    }

    const startTrackWarriorCommand = (type) => {
        if (!WARRIOR_COMMANDS.includes(type))
            throw new Error(`Invalid warrior command type: ${type}`);

        console.log('start track warrior command', type);

        const command = commands.value.find(c => c.team === 'player');
        command.type = type;
        warriorMarkerMesh.visible = true;
        isSettingWarriorCommand.value = true;
        domElement.value.addEventListener('pointerdown', onPointerDown);
        return true;
    }

    const stopTrackWarriorCommand = () => {
        isSettingWarriorCommand.value = false;
        const command = commands.value.find(c => c.team === 'player');
        setStateByFunction('warrior', command.type);
        domElement.value.removeEventListener('pointerdown', onPointerDown);
    }

    const setCommand = (type, position, team='player') => {
        const command = createCommand(team);

        command.type = type;
        command.position = position;
    }

    const getCommand = (team='player') => {
        const command = commands.value.find(c => c.team === team);
        return command;
    }

    const setStateByFunction = (primaryFunction, stateName, team='player') => {
        const stateMachine = useStateMachine()
        const unitsByFunction = units.value.filter(u => u.data.primary_function === primaryFunction);
        const unitsByTeam = unitsByFunction.filter(u => u.team === team);
        for (const unit of unitsByTeam) {
            console.log(`Setting unit ${unit.data.name} to state ${stateName}`);
            stateMachine.setState(unit.object3D.uuid, stateName);
        }
    }

    const findByName = (name) => {
        return units.value.find(u => u.data.name === name);
    }

    const findAllByTeam = (team) => {
        return units.value.filter(u => u.team === team);
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
        startTrackWarriorCommand,
        stopTrackWarriorCommand,
        WARRIOR_COMMANDS,
        isSettingWarriorCommand,
        setStateByFunction,
        findByName,
        findAllByTeam,
        countByName,
        countByNameAndTeam,
        setCommand,
        getCommand,
        countByTeam
    }
}
