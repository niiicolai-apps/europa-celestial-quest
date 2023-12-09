import { ref } from 'vue';
import { useBank } from '../bank.js';
import { useItems } from '../constructions.js';
import { removeMesh } from '../meshes.js';

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
    confirm: (selected, scene) => {
        if (!isSelling.value) return false;
        if (!selected.value.userData.isOwned) return false;

        isSelling.value = false;
        selected.value.userData.isOwned = false;
        
        for (const cost of selected.value.userData.costs) {
            bankManager.deposit(cost.amount, cost.currency);
        }

        removeMesh(selected.value);
        scene.remove(selected.value);
        useItems().removeItemFromState(selected.value);
        return true;
    },
    isSelling
}

export default SellController;
