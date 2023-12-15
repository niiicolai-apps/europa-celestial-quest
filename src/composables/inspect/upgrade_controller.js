import { ref } from 'vue';
import { useBank } from '../bank.js';
import { useItems } from '../constructions.js';
import { useObjectives } from '../objectives.js';
import { useToast } from '../toast.js';
import { setupUpgradeVisuals } from '../helpers/construction_helper.js'
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
        if (!isUpgrading.value) {
            useToast().add('toasts.upgrade_controller.not_upgrading', 4000, 'danger');
            return false;
        }

        if (!isUpgradeable(selected)) {
            useToast().add('toasts.upgrade_controller.not_upgradeable', 4000, 'danger');
            return false;
        } 
        
        const upgradeIndex = selected.value.userData.upgrade.index;
        const upgrades = selected.value.userData.upgrades;
        const nextUpgrade = upgrades[upgradeIndex];  

        const canAfford = useItems().canAfford(nextUpgrade.costs);
        if (!canAfford) {
            useToast().add('toasts.upgrade_controller.cannot_afford', 4000, 'danger');
            return false;
        }

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

        setupUpgradeVisuals(selected.value);
        
        useToast().add('toasts.upgrade_controller.success', 4000, 'success');
        return true;
    },
    isUpgradeable,
    isMaxUpgradeReached,
    isUpgrading
}

export default UpgradeController;
