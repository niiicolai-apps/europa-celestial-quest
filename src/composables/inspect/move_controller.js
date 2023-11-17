import { ref } from 'vue';
import { useBank } from '../bank.js';

const bankManager = useBank();

const isMoving = ref(false);
const lastPosition = ref(null);
const MoveController = {
    start: (selected) => {
        if (isMoving.value) return false;
        if (!selected.value) return false;

        isMoving.value = true,
        lastPosition.value = selected.value.position.clone();
        return true;
    },
    cancel: (selected) => {
        if (!isMoving.value) return false;

        isMoving.value = false;
        
        if (selected.value.userData.isOwned) {
            selected.value.position.copy(lastPosition.value);
        } else {
            console.log('Destroying selected (not implemented yet)');
        }
        return true;
    },
    confirm: (selected) => {
        if (!isMoving.value) return false;
        if (!selected.value.userData.isOwned) {
            let canAfford = true;
            for (const cost of selected.value.userData.costs) {
                if (!bankManager.bank.value.has(cost.amount, cost.currency)) {
                    canAfford = false;
                    break;
                }
            }

            if (canAfford) {
                for (const cost of selected.value.userData.costs) {
                    bankManager.bank.value.widthdraw(cost.amount, cost.currency);
                }
                selected.value.userData.isOwned = true;
            } else {
                return false;
            }
        }

        isMoving.value = false;
        lastPosition.value = null;
        return true;
    },
    isMoving
}

export default MoveController;
