import { ref } from 'vue';
import { useBank } from '../../bank/bank.js';
import { useItems } from '../../constructions/constructions.js';
import { removeMesh } from '../../models/meshes.js';
import { useToast } from '../../../composables/toast.js';
import { useCanvas } from '../../../composables/canvas.js';
import { usePlayers } from '../../players/player.js';
import ConstructionController from '../../constructions/construction_controller.js';
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

        const construction = ConstructionController.findByObject3D(selected.value);
        if (!construction.isOwned) {
            useToast().add('toasts.sell_controller.cannot_sell_unowned_construction', 4000, 'danger');
            return false;
        }

        /**
         * Ensure that the player cannot sell constructions
         * that the player are required to have a certain amount of.
         */
        const itemsManager = useItems();
        const requiredNumbers = construction.definition.requiredNumbers;
        if (requiredNumbers > 0) {
            const requiredItemCount = itemsManager.countByNameAndTeam(
                construction.definition.name,
                construction.team
            );
            const nextAmount = (requiredItemCount - 1);
            if (nextAmount < requiredNumbers) {
                useToast().add('toasts.sell_controller.cannot_sell_required_construction', 4000, 'danger');
                return false;
            }
        }

        isSelling.value = false;

        const team = construction.team;
        const bankManager = useBank();
        const bank = bankManager.get(team);
        
        for (const cost of construction.definition.costs) {
            bank.deposit(cost.amount, cost.currency);
        }
        
        useItems().removeItemFromState(selected.value);
        useToast().add('toasts.sell_controller.success', 4000, 'success');

        const playerManager = usePlayers();
        const player = playerManager.get(team);
        player.maxController.recalculateMax()

        return true;
    },
    isSelling
}

export default SellController;
