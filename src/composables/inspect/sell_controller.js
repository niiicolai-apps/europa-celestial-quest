import { ref } from 'vue';
import { useBank } from '../bank.js';

const bankManager = useBank();

const isSelling = ref(false);
const SellController = {
    start: (selected) => {
        if (isSelling.value) return false;
        if (!selected.value) return false;

        isSelling.value = true;
        return true;
    },
    cancel: (selected) => {
        if (!isSelling.value) return false;

        isSelling.value = false;
        return true;
    },
    confirm: (selected) => {
        if (!isSelling.value) return false;
        if (!selected.value.userData.isOwned) return false;

        isSelling.value = false;
        selected.value.userData.isOwned = false;
        console.log('Destroying selected (not implemented yet)');
        for (const cost of selected.value.userData.costs) {
            bankManager.bank.value.deposit(cost.amount, cost.currency);
        }
        return true;
    },
    isSelling
}

export default SellController;
