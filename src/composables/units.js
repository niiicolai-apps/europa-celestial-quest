import { ref } from 'vue';
import { useNavigation } from './navigation.js';
import { useGround } from './ground.js';
import { useResources } from './resources.js';
import { useItems } from './items.js';
import { useBank } from './bank.js';
import { useHealth } from './health.js';
import { removeMesh } from './meshes.js';
import * as THREE from 'three';
import UnitsBehavior from '../units/units_behavior.json';
import UnitStates from './unit_states.js';

const ground = useGround();
const units = ref([]);
const scene = ref(null);

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


const setAction = (unit, actionIndex) => {
    unit.actionIndex = actionIndex;

    if (unit.action) {
        unit.action.exit();
    }

    const action = unit.state.actions[actionIndex];
    const nextClazz = UnitStates[action.method.toUpperCase()];
    const command = commands.value.find(c => c.team === unit.team);
    unit.action = new nextClazz(unit, { command, ...action.options });
    unit.action.enter();
}

const loop = () => {
    for (const unit of units.value) {
        const behavior = UnitsBehavior[unit.data.primary_function];
        if (!unit.state) {
            unit.state = behavior.states[0];
        }
        if (!unit.action) {
            setAction(unit, 0);
        }

        if (unit.action?.isComplete()) {
            const actionIndex = unit.actionIndex;
            const nextActionIndex = (actionIndex + 1) % unit.state.actions.length;
            setAction(unit, nextActionIndex);
        }

        unit.action?.update();
    }
}

export const useUnits = () => {

    const featuresToOptions = (features) => {
        const options = {};
        for (const feature of features) {
            options[feature.name] = {...feature.options};
        }
        return options;
    }

    const init = async (_scene, _domElement) => {
        scene.value = _scene;
        scene.value.add(warriorMarkerMesh);
        domElement.value = _domElement;
        warriorMarkerMesh.visible = false;
    }

    const add = (object3D, data, team = 'player') => {
        // Create unit options
        const options = featuresToOptions(data.features);

        // Create unit
        const unit = {
            object3D,
            data,
            options,
            action: null,
            actionIndex: 0,
            state: null,
            target: null,
            team
        };
        
        // Add unit to units list
        units.value.push(unit);

        // Add unit command controller
        const existingCommand = commands.value.find(c => c.team === team);
        if (!existingCommand) {
            commands.value.push({ 
                team, 
                type: 'regroup', 
                position: { x: 0, y: 0, z: 0 } 
            });
        }

        // Add unit to health system
        if (options.health) {
            useHealth().addHealthObject(
                object3D,
                team,
                options.health.current,
                options.health.maxHealth,
                // onDie
                () => {
                    remove(object3D)
                    scene.value.remove(object3D)
                    removeMesh(object3D)
                },
                // onDamage
                (attacker) => {
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
                    setAction(unit, 0);
                }
            )
        }
    }

    const remove = (object3D) => {
        units.value = units.value.filter(u => u.object3D.uuid !== object3D.uuid);
    }

    const enable = () => {
        setInterval(loop, 1000);
    }

    const disable = () => {
        clearInterval(loop);
    }

    const onPointerDown = (event) => {
        const point = ground.getIntersectionFromMouse(event);
        if (!point) return;

        const command = commands.value.find(c => c.team === 'player');
        command.position = point;
        warriorMarkerMesh.position.copy(point);
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
        const command = commands.value.find(c => c.team === team);
        if (!command) {
            commands.value.push({ team, type, position });
            return;
        }

        command.type = type;
        command.position = position;
    }

    const setStateByFunction = (primaryFunction, stateName, team='player') => {
        const behavior = UnitsBehavior[primaryFunction];
        const state = behavior.states.find(s => s.name === stateName);
        if (!state) {
            throw new Error(`State not found: ${stateName}`);
        }

        for (const unit of units.value) {
            if (unit.team !== team) continue;
            if (unit.data.primary_function !== primaryFunction) continue;
            unit.state = state;
            setAction(unit, 0);
        }
        console.log(`Set state ${stateName} for ${primaryFunction} units`);
    }

    const findByName = (name) => {
        return units.value.find(u => u.data.name === name);
    }

    const countByName = (name) => {
        return units.value.filter(u => u.data.name === name).length;
    }

    return {
        units,
        init,
        add,
        remove,
        enable,
        disable,
        startTrackWarriorCommand,
        stopTrackWarriorCommand,
        WARRIOR_COMMANDS,
        isSettingWarriorCommand,
        setStateByFunction,
        findByName,
        countByName,
        setCommand,
    }
}
