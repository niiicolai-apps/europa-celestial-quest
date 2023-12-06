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

const collect = (unit) => {
    const shouldCollect = unit.options.collect.collected < unit.options.collect.max;
    if (shouldCollect) {
        if (unit.options.collect.resource) {
            if (navigation.reachedDestination(unit.object3D, unit.options.collect.resource.position, 5)) {
                const canAfford = bank.canAfford(unit.options.collect.costs);
                if (!canAfford) return;
                for (const cost of unit.options.collect.costs) {
                    bank.withdraw(cost.amount, cost.currency);
                }
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

const regroup = (unit) => {
    navigation.addAgent(
        unit.object3D,
        warriorCommand.value.position,
        unit.options.move.speed,
        unit.options.move.groundOffset
    );
}

const attack = (unit) => {
    navigation.addAgent(
        unit.object3D,
        warriorCommand.value.position,
        unit.options.move.speed,
        unit.options.move.groundOffset
    );
}

const scan = (unit) => {
    if (unit.options.scan.scanned) {
        if (unit.options.scan.deliver_to) {
            if (navigation.reachedDestination(unit.object3D, unit.options.scan.deliver_to.position, 15)) {
                bank.deposit(unit.options.scan.rate, unit.options.scan.type);
                unit.options.scan.deliver_to = null;
                unit.options.scan.scanned = false;
                console.log('delivered');
            } else {
                navigation.addAgent(
                    unit.object3D,
                    unit.options.scan.deliver_to.position,
                    unit.options.move.speed,
                    unit.options.move.groundOffset
                );
            }
        } else {
            const deliver_to = useItems().findClosestItem(unit.object3D.position, unit.options.scan.deliver_construction);
            if (deliver_to) {
                unit.options.scan.deliver_to = deliver_to;
            } else {
                console.log('no deliver to');
            }
        }
    } else {
        if (unit.options.scan.next_position) {
            if (navigation.reachedDestination(unit.object3D, unit.options.scan.next_position, 15)) {
                const canAfford = bank.canAfford(unit.options.scan.costs);
                if (!canAfford) return;
                for (const cost of unit.options.scan.costs) {
                    bank.withdraw(cost.amount, cost.currency);
                }
                unit.options.scan.next_position = null;
                unit.options.scan.scanned = true;
                console.log('delivered');
            } else {
                navigation.addAgent(
                    unit.object3D,
                    unit.options.scan.next_position,
                    unit.options.move.speed,
                    unit.options.move.groundOffset
                );
            }
        } else {
            const resource = resources.getRandom();
            if (resource) {
                unit.options.scan.next_position = resource.object3D.position;
            } else {
                console.log('no resource');
            }
        }
    }
}

const loop = () => {
    for (const unit of units.value) {

        if (unit.data.primary_function === 'collector') {
            collect(unit);
        }
        else if (unit.data.primary_function === 'warrior') {
            if (warriorCommand.value.type === 'regroup') {
                if (navigation.reachedDestination(unit.object3D, warriorCommand.value.position)) continue;
                regroup(unit);
            } else if (warriorCommand.value.type === 'attack') {
                if (navigation.reachedDestination(unit.object3D, warriorCommand.value.position)) continue;
                attack(unit);
            }
        }
        else if (unit.data.primary_function === 'scanner') {
            scan(unit);
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

    const init = async (scene, _domElement) => {
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
        warriorCommand,
        isSettingWarriorCommand,
        findByName,
        countByName,
    }
}
