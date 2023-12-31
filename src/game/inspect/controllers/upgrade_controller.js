import { ref } from 'vue';
import { useBank } from '../../bank/bank.js';
import { useItems } from '../../constructions/constructions.js';
import { useObjectives } from '../../objectives/objectives.js';
import { useToast } from '../../../composables/toast.js';
import { usePlayers } from '../../players/player.js';
import { setupUpgradeVisuals } from '../../../composables/helpers/construction_helper.js'
import ConstructionController from '../../constructions/construction_controller.js';

const isUpgrading = ref(false);

const isUpgradeable = (selected) => {
    if (!selected.value) return false;

    const construction = ConstructionController.findByObject3D(selected.value);
    if (!construction) return false;
    if (!construction.isOwned) return false;
    return construction.isUpgradeable();
};

const isMaxUpgradeReached = (selected) => {
    const construction = ConstructionController.findByObject3D(selected.value);
    return construction.isMaxUpgradeReached();
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

        const construction = ConstructionController.findByObject3D(selected.value);
        const upgrades = construction.upgrades; 
        const upgradeIndex = construction.upgradeIndex;
        const nextUpgrade = upgrades[upgradeIndex + 1];  

        const team = construction.team;
        const players = usePlayers();
        const player = players.get(team);

        const bankManager = useBank();
        const bank = bankManager.get(team);

        const canAfford = bank.canAfford(nextUpgrade.costs);
        if (!canAfford) {
            useToast().add('toasts.upgrade_controller.cannot_afford', 4000, 'danger');
            return false;
        }

        for (const cost of nextUpgrade.costs) {
            bank.withdraw(cost.amount, cost.currency);
        }

        isUpgrading.value = false;
        construction.upgradeToNext();

        useObjectives().tryCompleteIncompletes();
        useItems().recalculateStorage(team);

        useToast().add('toasts.upgrade_controller.success', 4000, 'success');
        
        player.saveData();
        
        return true;
    },
    isUpgradeable,
    isMaxUpgradeReached,
    isUpgrading
}

export default UpgradeController;
