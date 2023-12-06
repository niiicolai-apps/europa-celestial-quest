import { ref } from 'vue';
import { useBank } from '../bank.js';
import { useItems } from '../items.js';
import { useObjectives } from '../objectives.js';
const bankManager = useBank();

const isUpgrading = ref(false);

const isUpgradeable = (selected) => {
    if (!selected.value) return false;
    if (!selected.value.userData.isOwned) return false;
    if (!selected.value.userData.upgrades) return false;
    if (selected.value.userData.upgrades.length === 0) return false;
    return true;
};

const isMaxUpgradeReached = (selected) => {
    if (selected.value.userData.upgrade.index >= selected.value.userData.upgrades.length-1) return true;
    return false;
}

const UpgradeController = {
    start: (selected) => {
        if (isUpgrading.value) return false;
        if (!selected.value) return false;

        isUpgrading.value = true;
        return true;
    },
    cancel: (selected) => {
        if (!isUpgrading.value) return false;

        isUpgrading.value = false;
        return true;
    },
    confirm: (selected) => {
        if (!isUpgrading.value) return false;
        if (!isUpgradeable(selected)) return false;    
        const upgradeIndex = selected.value.userData.upgrade.index;
        const nextUpgrade = selected.value.userData.upgrades[upgradeIndex];  

        const canAfford = useItems().canAfford(nextUpgrade.costs);
        if (!canAfford) return false;

        for (const cost of nextUpgrade.costs) {
            bankManager.withdraw(cost.amount, cost.currency);
        }

        if (selected.value.userData.canStore) {
            useItems().recalculateStorage();
        }

        isUpgrading.value = false;
        selected.value.userData.upgrade.index++;
        useObjectives().tryCompleteIncompletes();
        useItems().saveState();
        
        return true;
    },
    isUpgradeable,
    isMaxUpgradeReached,
    isUpgrading
}

export default UpgradeController;
