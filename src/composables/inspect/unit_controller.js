import { ref } from 'vue';
import { useBank } from '../bank.js';
import { useItems } from '../constructions.js';
import { getMesh } from '../meshes.js';
import { useUnits } from '../units.js';
import { useObjectives } from '../objectives.js';
import ConstructionDefinitions from '../definitions/constructions.js'
import * as THREE from 'three';

const unitManager = useUnits();
const bankManager = useBank();
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
        const time = Date.now();

        for (let i = queue.length - 1; i >= 0; i--) {
            const unit = queue[i];
            if (time < unit.completeTime) continue;

            const unitMesh = await getMesh(unit.unit.mesh);
            scene.add(unitMesh);

            const selectedBox3 = new THREE.Box3().setFromObject(s);
            const size = selectedBox3.getSize(new THREE.Vector3());
            unitMesh.position.copy(s.position);
            unitMesh.position.z += size.z / 2;

            const unitBox3 = new THREE.Box3().setFromObject(unitMesh);
            const unitSize = unitBox3.getSize(new THREE.Vector3());
            
            unitMesh.position.y += unitSize.y / 2;
            unitManager.add(unitMesh, unit.unit);

            queue.splice(i, 1);
        }

        s.userData.unitQueue = queue;

        useObjectives().tryCompleteIncompletes();
        //useItems().saveState();
    },
    queueUnit: async (selected, unitName) => {
        if (!isBuilding.value) return false;
        if (!selected.value.userData.isOwned) return false;

        const units = BuildController.getAllowedUnits(selected);
        const unit = units.find(unit => unit.name === unitName);
        if (!unit) return false;

        const canAfford = bankManager.canAfford(unit.costs);
        if (!canAfford) return false;

        for (const cost of unit.costs) {
            bankManager.withdraw(cost.amount, cost.currency);
        }

        if (!selected.value.userData.unitQueue) {
            selected.value.userData.unitQueue = [];
        }

        const startTime = Date.now();
        const completeTime = startTime + unit.complete_time;
        selected.value.userData.unitQueue.push({ unit, completeTime, startTime });

        useItems().saveState();
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