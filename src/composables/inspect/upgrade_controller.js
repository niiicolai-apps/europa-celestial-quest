import { ref } from 'vue';
import { useBank } from '../bank.js';

const bankManager = useBank();

const isUpgrading = ref(false);
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
        if (!selected.value.userData.isOwned) return false;

        isUpgrading.value = false;
        
        console.log('Upgrading selected (not implemented yet)');
        /*
        selected.value.userData.isOwned = false;
        for (const cost of selected.value.userData.costs) {
            bankManager.bank.value.widthdraw(cost.amount, cost.currency);
        }*/
        return true;
    },
    isUpgrading
}

export default UpgradeController;
