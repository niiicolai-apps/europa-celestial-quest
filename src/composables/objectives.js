import { ref } from 'vue'
import GameObjective from 'game-objectives';

const controller = ref(null);
const isInitialized = ref(false);

export function useObjectives(player) {
    const init = () => {
        if (isInitialized.value) return;
        // 1. create a goal
        const goal = GameObjective.Goal.create('Move to origo', (options) => {
            // Note: options is the player.
            return (
            options.value.position.x === 0
            && options.value.position.y === 0
            && options.value.position.z === 0
            )
        })
        
        // 2. create a reward
        const reward = GameObjective.Reward.create('100 Experience', (options) => {
            // Note: options is the player.
            options.value.experience += 100;
        })
        
        // 3. create an objective using the goal and reward
        const objective = GameObjective.Objective.create(
            'Move to origo',
            'Find origo and get 100 experience',
            [goal],
            [reward]
        );
        
        // 4. create player and objectives controller
        controller.value = GameObjective.Controller.create(player);

        // 5. add objective to controller
        if (!controller.value.findByName(objective.name)) {
            controller.value.add(objective);
        }

        isInitialized.value = true;
    }

    return {
        init,
        controller
    }
}
