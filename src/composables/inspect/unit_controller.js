import { ref } from 'vue';
import { useBank } from '../bank.js';
import { useItems } from '../items.js';
import { removeMesh } from '../meshes.js';

const bankManager = useBank();
const itemsManager = useItems();
const isBuilding = ref(false);

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
    getAllowedUnits: (selected) => {
        if (!selected.value.userData.isOwned) return [];

        const upgradeIndex = selected.value.userData.upgrade.index;
        const upgrades = selected.value.userData.upgrades;
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
    canBuild: (selected) => {
        if (!selected.value.userData.isOwned) return false;
        
        const upgradeIndex = selected.value.userData.upgrade.index;
        const upgrades = selected.value.userData.upgrades;
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