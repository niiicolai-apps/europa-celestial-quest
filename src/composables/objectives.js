import { ref } from 'vue'
import { useMap } from './map.js'
import { useStats } from './stats.js';
import { useItems } from './items.js';
import { useUnits } from './units.js';
import { useBank } from './bank.js';
import PersistentData from './persistent_data.js';
import GameObjective from 'game-objectives';

const map = useMap();
const stats = useStats();
const bank = useBank();
const controller = ref(null);
const isInitialized = ref(false);

export function useObjectives(player) {
    const init = async () => {
        if (isInitialized.value) return;

        controller.value = GameObjective.Controller.create(player);

        const pd = await PersistentData.get('completed_objectives');
        const completedObjectives = pd || [];

        const itemsManager = useItems();
        const unitsManager = useUnits();

        const mapData = map.map.value;
        const rewardCache = [];        

        for (const objectiveData of mapData.objectives) {
            const goals = [];
            const rewards = [];

            for (const goalData of objectiveData.goals) {
                const goal = GameObjective.Goal.create(goalData.name, (options) => {

                    if (goalData.options.construction) {
                        const constructionCount = itemsManager.countItemsByName(goalData.options.construction.name);
                        return goalData.options.min 
                            ? constructionCount >= goalData.options.min
                            : constructionCount > 0;
                    }
                    else if (goalData.options.unit) {
                        const unitCount = unitsManager.countByName(goalData.options.unit.name);
                        return goalData.options.min
                            ? unitCount >= goalData.options.min
                            : unitCount > 0;
                    }
                    else if (goalData.options.upgrade) {
                        const constructionCount = itemsManager.countItemsByNameAndUpgrade(
                            goalData.options.upgrade.name, 
                            goalData.options.upgrade.upgradeIndex
                        );
                        return goalData.options.min 
                            ? constructionCount >= goalData.options.min
                            : constructionCount > 0;
                    }
                    else if (goalData.options.bank) {
                        const balance = bank.getBalance(goalData.options.bank.currency);
                        return balance >= goalData.options.bank.balance;
                    }
                })
                goals.push(goal);
            }

            for (const rewardData of objectiveData.rewards) {
                const existingReward = rewardCache.find(r => r.name === rewardData.name);
                if (existingReward) {
                    rewards.push(existingReward);
                    continue;
                }

                const reward = GameObjective.Reward.create(rewardData.name, (options) => {

                    if (rewardData.options.stat) {
                        stats.addExperience(rewardData.options.stat.value);
                    }
                })
                rewards.push(reward);
                rewardCache.push(reward);
            }

            const objective = GameObjective.Objective.create(
                objectiveData.name,
                objectiveData.description,
                goals,
                rewards
            );

            if (!controller.value.findByName(objective.name)) {
                const completed = completedObjectives.find(o => o === objective.name);
                controller.value.add(objective, completed);
            }
        }
        
        isInitialized.value = true;
    }

    const tryCompleteIncompletes = () => {
        if (!isInitialized.value) return;
        controller.value.tryCompleteIncompletes();
        const completed = controller.value.findCompleted();
        const completedNames = completed.map(o => o.name);
        PersistentData.set('completed_objectives', completedNames);
    }

    return {
        init,
        controller,
        tryCompleteIncompletes,
    }
}
