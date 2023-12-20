import { ref } from 'vue';
import { useBank } from '../../bank/bank.js';
import { useItems } from '../../constructions/constructions.js';
import { removeMesh } from '../../models/meshes.js';
import { useToast } from '../../../composables/toast.js';
import { useCanvas } from '../../../composables/canvas.js';
import { usePlayers } from '../../players/player.js';
import CONSTRUCTIONS from '../../definitions/constructions.js';

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
        if (!isSelling.value) {
            useToast().add('toasts.sell_controller.not_selling', 4000, 'danger');
            return false;
        }

        if (!selected.value.userData.isOwned) {
            useToast().add('toasts.sell_controller.cannot_sell_unowned_construction', 4000, 'danger');
            return false;
        }

        /**
         * Ensure that the player cannot sell constructions
         * that the player are required to have a certain amount of.
         */
        const itemsManager = useItems();
        const definition = CONSTRUCTIONS.find((construction) => construction.name === selected.value.name);
        const requiredNumbers = definition.requiredNumbers;
        if (requiredNumbers > 0) {
            const requiredItemCount = itemsManager.countByNameAndTeam(
                selected.value.name,
                selected.value.userData.team
            );
            const nextAmount = (requiredItemCount - 1);
            if (nextAmount < requiredNumbers) {
                useToast().add('toasts.sell_controller.cannot_sell_required_construction', 4000, 'danger');
                return false;
            }
        }

        isSelling.value = false;
        selected.value.userData.isOwned = false;

        const team = selected.value.userData.team;
        const bankManager = useBank();
        const bank = bankManager.get(team);
        
        for (const cost of selected.value.userData.costs) {
            bank.deposit(cost.amount, cost.currency);
        }

        const canvas = useCanvas();
        const adapter = canvas.adapter.value;
        const scene = adapter.scene;

        removeMesh(selected.value);
        scene.remove(selected.value);

        useItems().removeItemFromState(selected.value);
        useToast().add('toasts.sell_controller.success', 4000, 'success');
        usePlayers().savePlayers();

        return true;
    },
    isSelling
}

export default SellController;
