import { ref } from 'vue';
import { useNavigation } from './navigation.js';
import { useGround } from './ground.js';
import { useResources } from './resources.js';
import { useItems } from './items.js';
import { useBank } from './bank.js';
import * as THREE from 'three';

const ground = useGround();
const navigation = useNavigation();
const resources = useResources();
const bank = useBank();
const units = ref([]);

const isSettingWarriorCommand = ref(false);
const warriorCommand = ref({ type: 'regroup', position: { x: 0, y: 0, z: 0 } });
const WARRIOR_COMMANDS = ['regroup', 'attack'];

const warriorMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const warriorMarkerGeometry = new THREE.BoxGeometry(1, 1, 1);
const warriorMarkerMesh = new THREE.Mesh(warriorMarkerGeometry, warriorMarkerMaterial);

const domElement = ref(null);

const loop = () => {
    for (const unit of units.value) {

        if (unit.data.primary_function === 'collector') {
            const shouldCollect = unit.options.collect.collected < unit.options.collect.max;
            if (shouldCollect) {
                if (unit.options.collect.resource) {
                    if (navigation.reachedDestination(unit.object3D, unit.options.collect.resource.position, 5)) {
                        unit.options.collect.collected = unit.options.collect.max;
                        unit.options.collect.resource = null;
                        console.log('collected');
                    } else {
                        navigation.addAgent(
                            unit.object3D, 
                            unit.options.collect.resource.position, 
                            unit.options.move.speed,
                            unit.options.move.groundOffset
                        );
                    }
                } else {
                    const closestResource = resources.findClosest(unit.object3D.position, unit.options.collect.type);
                    if (closestResource) {
                        unit.options.collect.resource = closestResource;
                    } else {
                        console.log('no resource');
                    }
                }

            } else {
                if (unit.options.collect.deliver_to) {
                    if (navigation.reachedDestination(unit.object3D, unit.options.collect.deliver_to.position, 15)) {
                        bank.deposit(unit.options.collect.collected, unit.options.collect.type);
                        unit.options.collect.deliver_to = null;
                        unit.options.collect.collected = 0;
                        console.log('delivered');
                    } else {
                        navigation.addAgent(
                            unit.object3D, 
                            unit.options.collect.deliver_to.position, 
                            unit.options.move.speed,
                            unit.options.move.groundOffset
                        );
                    }
                } else {
                    const deliver_to = useItems().findClosestItem(unit.object3D.position, unit.options.collect.deliver_construction);
                    if (deliver_to) {
                        unit.options.collect.deliver_to = deliver_to;
                    } else {
                        console.log('no deliver to');
                    }
                }
            }
        }
        else if (unit.data.primary_function === 'warrior') {
            if (warriorCommand.value.type === 'regroup') {
                if (navigation.reachedDestination(unit.object3D, warriorCommand.value.position)) continue;

                navigation.addAgent(
                    unit.object3D, 
                    warriorCommand.value.position, 
                    unit.options.move.speed,
                    unit.options.move.groundOffset
                );
            } else if (warriorCommand.value.type === 'attack') {
                console.log('attack');
            }
        }
    }
}

export const useUnits = () => {

    const featuresToOptions = (features) => {
        const options = {};
        for (const feature of features) {
            options[feature.name] = feature.options;
        }
        return options;
    }

    const init = (scene, _domElement) => {
        scene.add(warriorMarkerMesh);
        warriorMarkerMesh.visible = false;
        domElement.value = _domElement;
    }

    const add = (object3D, data) => {
        const options = featuresToOptions(data.features);
        units.value.push({ object3D, data, options });
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

        warriorCommand.value.position = point;
        warriorMarkerMesh.position.copy(point);
        stopTrackWarriorCommand();
    }

    const startTrackWarriorCommand = (type) => {
        if (!WARRIOR_COMMANDS.includes(type)) 
            throw new Error(`Invalid warrior command type: ${type}`);

        console.log('start track warrior command', type);

        warriorCommand.value.type = type;
        warriorMarkerMesh.visible = true;
        isSettingWarriorCommand.value = true;
        domElement.value.addEventListener('pointerdown', onPointerDown);
        return true;
    }

    const stopTrackWarriorCommand = () => {
        isSettingWarriorCommand.value = false;
        domElement.value.removeEventListener('pointerdown', onPointerDown);
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
        warriorCommand,
        isSettingWarriorCommand,
    }
}
