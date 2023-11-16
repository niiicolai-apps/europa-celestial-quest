import { ref } from 'vue';
import { useBank } from '../bank.js';

const bankManager = useBank();

const isSelling = ref(false);
const SellController = {
    start: (selected) => {
        if (isSelling.value) return;
        if (!selected.value) return;

        isSelling.value = true;
    },
    cancel: (selected) => {
        if (!isSelling.value) return;

        isSelling.value = false;
    },
    confirm: (selected) => {
        if (!isSelling.value) return;
        if (!selected.value.userData.isOwned) return;

        isSelling.value = false;
        selected.value.userData.isOwned = false;
        console.log('Destroying selected (not implemented yet)');
        for (const cost of selected.value.userData.costs) {
            bankManager.bank.value.deposit(cost.amount, cost.currency);
        }
    },
    isSelling
}

export default SellController;
