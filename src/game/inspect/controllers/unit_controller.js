import { ref } from 'vue';
import { useBank } from '../../bank/bank.js';
import { useItems } from '../../constructions/constructions.js';
import { getMesh } from '../../../composables/meshes.js';
import { useUnits } from '../../units/units.js';
import { useObjectives } from '../../objectives/objectives.js';
import { useToast } from '../../../composables/toast.js';
import { usePlayers } from '../../players/player.js';
import ConstructionDefinitions from '../../definitions/constructions.js'
import * as THREE from 'three';

const unitManager = useUnits();
const isBuilding = ref(false);

const getConstructionDefinition = (name) => {
    return ConstructionDefinitions.find(definition => definition.name === name);
}

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
        const queue = BuildController.getQueue(selected);
        if (queue.length == 0) return;

        const playerManager = usePlayers();
        const team = s.userData.team;
        const player = playerManager.get(team);
        const time = Date.now();

        for (let i = queue.length - 1; i >= 0; i--) {
            const unit = queue[i];
            if (time < unit.completeTime) continue;

            const unitMesh = await player.spawnUnit(unit.unit);
            scene.add(unitMesh);

            const selectedBox3 = new THREE.Box3().setFromObject(s);
            const size = selectedBox3.getSize(new THREE.Vector3());
            unitMesh.position.copy(s.position);
            unitMesh.position.z += size.z / 2;

            const unitBox3 = new THREE.Box3().setFromObject(unitMesh);
            const unitSize = unitBox3.getSize(new THREE.Vector3());

            unitMesh.position.y += unitSize.y / 2;

            queue.splice(i, 1);
        }

        s.userData.unitQueue = queue;
        useObjectives().tryCompleteIncompletes();
    },
    queueUnit: async (selected, unitName) => {
        if (!isBuilding.value) {
            useToast().add('toasts.unit_controller.not_building', 4000, 'danger');
            return false;
        }

        if (!selected.value.userData.isOwned) {
            useToast().add('toasts.unit_controller.cannot_spawn_unowned_construction', 4000, 'danger');
            return false;
        }

        const units = BuildController.getAllowedUnits(selected);
        const unit = units.find(unit => unit.name === unitName);
        if (!unit) {
            useToast().add('toasts.unit_controller.invalid_unit', 4000, 'danger');
            return false;
        }

        const team = selected.value.userData.team;
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

        if (!selected.value.userData.unitQueue) {
            selected.value.userData.unitQueue = [];
        }

        const startTime = Date.now();
        const completeTime = startTime + unit.complete_time;
        selected.value.userData.unitQueue.push({ unit, completeTime, startTime });

        useToast().add('toasts.unit_controller.success', 4000, 'success');

        return true;
    },
    getAllowedUnits: (selected) => {
        if (!selected.value.userData.isOwned) return [];

        const construction = getConstructionDefinition(selected.value.name);
        const upgradeIndex = selected.value.userData.upgrade.index;
        const upgrades = construction.upgrades;
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
        return s.userData.unitQueue || [];
    },
    canBuild: (selected) => {
        const s = selected.value || selected;

        const construction = getConstructionDefinition(s.name);
        const upgradeIndex = s.userData.upgrade.index;
        const upgrades = construction.upgrades;
        if (!upgrades || upgrades.length == 0) return false;

        let can = false;
        for (let i = 0; i < upgrades.length; i++) {
            if (i <= upgradeIndex) {
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