import { ref } from 'vue';
import { useBank } from '../../bank/bank.js';
import { useItems } from '../../constructions/constructions.js';
import { getMesh } from '../../models/meshes.js';
import { useUnits } from '../../units/units.js';
import { useObjectives } from '../../objectives/objectives.js';
import { useToast } from '../../../composables/toast.js';
import { usePlayers } from '../../players/player.js';
import { useMax } from '../../map/max.js';
import ConstructionController from '../../constructions/construction_controller.js';
import * as THREE from 'three';

const isBuilding = ref(false);
const queues = ref([]);

const BuildController = {
    start: (selected) => {
        if (isBuilding.value) return false;
        if (!selected.value) return false;

        isBuilding.value = true;
        return true;
    },
    cancel: (selected) => {
        if (!isBuilding.value) return false;

        isBuilding.value = false;
        return true;
    },
    dequeueAny: async (selected, scene) => {
        const s = selected.value || selected;
        const construction = ConstructionController.findByObject3D(s);
        const queueData = BuildController.getQueue(s);
        if (!queueData || queueData.queue.length == 0) return;

        const queue = queueData.queue;
        const playerManager = usePlayers();
        const team = construction.team;
        const player = playerManager.get(team);
        const time = Date.now();

        const maxManager = useMax();
        const maxController = maxManager.find(team);
        if (!maxController.canSpawnOneMoreUnit()) {
            return;
        }

        for (let i = queue.length - 1; i >= 0; i--) {
            const unit = queue[i];
            if (time < unit.completeTime) continue;

            const unitMesh = await player.spawnUnit(unit.unit);

            const selectedBox3 = new THREE.Box3().setFromObject(s);
            const size = selectedBox3.getSize(new THREE.Vector3());
            unitMesh.position.copy(s.position);
            unitMesh.position.z += size.z / 2;

            const unitBox3 = new THREE.Box3().setFromObject(unitMesh);
            const unitSize = unitBox3.getSize(new THREE.Vector3());

            unitMesh.position.y += unitSize.y / 2;

            queue.splice(i, 1);
            break;
        }

        BuildController.setQueue(selected, queue);
        useObjectives().tryCompleteIncompletes();
    },
    queueUnit: async (selected, unitName) => {
        if (!isBuilding.value) {
            useToast().add('toasts.unit_controller.not_building', 4000, 'danger');
            return false;
        }

        const s = selected.value || selected;
        const construction = ConstructionController.findByObject3D(s);

        if (!construction.isOwned) {
            useToast().add('toasts.unit_controller.cannot_spawn_unowned_construction', 4000, 'danger');
            return false;
        }

        const team = construction.team;
        const maxManager = useMax();
        const maxController = maxManager.find(team);
        if (!maxController.canSpawnOneMoreUnit()) {
            useToast().add('toasts.unit_controller.max_units', 4000, 'danger');
            return false;
        }

        const units = BuildController.getAllowedUnits(selected);
        const unit = units.find(unit => unit.name === unitName);
        if (!unit) {
            useToast().add('toasts.unit_controller.invalid_unit', 4000, 'danger');
            return false;
        }

        const bankManager = useBank();
        const bank = bankManager.get(team);
        const canAfford = bank.canAfford(unit.costs);
        if (!canAfford) {
            useToast().add('toasts.unit_controller.cannot_afford', 4000, 'danger');
            return false;
        }

        for (const cost of unit.costs) {
            bank.withdraw(cost.amount, cost.currency);
        }

        const startTime = Date.now();
        const completeTime = startTime + unit.complete_time;
        BuildController.addToQueue(selected, { unit, completeTime, startTime }, team);

        useToast().add('toasts.unit_controller.success', 4000, 'success');

        return true;
    },
    getAllowedUnits: (selected) => {
        const s = selected.value || selected;
        const construction = ConstructionController.findByObject3D(s);

        if (!construction.isOwned) return [];
        
        const upgrades = construction.upgrades;
        const upgradeIndex = construction.upgradeIndex;
        if (!upgrades || upgrades.length == 0) return [];

        let allowedUnits = [];
        for (let i = 0; i < upgrades.length; i++) {
            if (i <= upgradeIndex) {
                if (upgrades[i].units && upgrades[i].units.length > 0) {
                    allowedUnits = allowedUnits.concat(upgrades[i].units);
                }
            }
        }
        return allowedUnits;
    },
    getQueue: (selected) => {
        const s = selected.value || selected;
        return queues.value.find(q => q.uuid === s.uuid);        
    },
    setQueue: (selected, queue=[], team) => {
        const s = selected.value || selected;
        const uuid = s.uuid;
        const index = queues.value.findIndex(q => q.uuid === uuid);
        if (index === -1) {
            queues.value.push({ uuid, queue, team });
        } else {
            queues.value[index] = { uuid, queue, team };
        }
    },
    addToQueue: (selected, unit, team) => {
        const queueData = BuildController.getQueue(selected);
        const queueArray = queueData ? queueData.queue : [];
        console.log('adding to queue', queueData)
        queueArray.push(unit);
        BuildController.setQueue(selected, queueArray, team);
    },
    getQueueUnitCount: (team) => {
        let count = 0;
        for (const queue of queues.value) {
            if (queue.team === team) {
                count += queue.queue.length;
            }
        }
        return count;
    },
    canBuild: (selected) => {
        const s = selected.value || selected;
        const construction = ConstructionController.findByObject3D(s);
        const upgrades = construction.upgrades;
        if (!upgrades || upgrades.length == 0) return false;

        let can = false;
        for (let i = 0; i < upgrades.length; i++) {
            if (i <= construction.upgradeIndex) {
                if (upgrades[i].units && upgrades[i].units.length > 0) {
                    can = true;
                    break;
                }
            }
        }
        return can;
    },
    isBuilding
}

export default BuildController;