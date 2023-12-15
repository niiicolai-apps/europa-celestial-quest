import { ref } from 'vue'
import { useMap } from './map.js'
import { useStats } from './stats.js';
import { useItems } from './constructions.js';
import { useUnits } from './units.js';
import { useBank } from './bank.js';
import { useToast } from './toast.js';
import { useTimeline } from './timeline.js';
import PersistentData from './persistent_data.js';
import GameObjective from 'game-objectives';

const map = useMap();
const stats = useStats();
const bank = useBank();
const controller = ref(null);
const availableObjectives = ref([]);
const isInitialized = ref(false);

export function useObjectives(player) {
    const init = async () => {
        if (isInitialized.value) return;

        controller.value = GameObjective.Controller.create(player);

        const pd = await PersistentData.get('completed_objectives');
        const completedObjectives = pd || [];

        const itemsManager = useItems();
        const unitsManager = useUnits();

        const objectivesData = await map.objectives();
        const rewardCache = [];        

        for (const objectiveData of objectivesData) {
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

            availableObjectives.value.push({objective, data: objectiveData});

            const completed = completedObjectives.find(o => o === objective.name);
            if (completed) {
                controller.value.add(objective, true);
            }
        }

        addNewAvailable();
        
        isInitialized.value = true;
    }

    const hasUnlocked = (objective) => {
        const availableObjective = availableObjectives.value.find(o => o.objective.name === objective.name);
        if (!availableObjective) throw new Error(`Objective not found: ${objective.name}`);
        const { requiredLevel, requiredObjectives } = availableObjective.data;
        const completedNames = controller.value.findCompleted().map(o => o.name);
        let isCompletedRequired = true;
        for (const requiredObjective of requiredObjectives) {
            if (!completedNames.includes(requiredObjective)) {
                isCompletedRequired = false;
                break;
            }
        }
        return isCompletedRequired && stats.stat.value.level >= requiredLevel;
    }

    const addNewAvailable = () => {
        const completedNames = controller.value.findCompleted().map(o => o.name);
        let added = false;
        for (const obj of availableObjectives.value) {
            if (completedNames.includes(obj.objective.name)) continue;
            if (!hasUnlocked(obj.objective)) continue;
            add(obj.objective, false);
            added = true;
        }

        if (added) {
            useToast().add(`toasts.objectives.added_new`, 4000, 'info');
        }
    }

    const add = (objective, completed) => {
        if (!controller.value.findByName(objective.name)) {
            controller.value.add(objective, completed);
        }
    }

    const tryCompleteIncompletes = async () => {
        if (!isInitialized.value) return;
        const getCompletedNames = () => controller.value.findCompleted().map(o => o.name);
        const completedNamesBefore = getCompletedNames();

        controller.value.tryCompleteIncompletes();

        const completedNamesAfter = getCompletedNames();
        const newCompletedNames = completedNamesAfter.filter(name => !completedNamesBefore.includes(name));
        const hasNewCompleted = newCompletedNames.length > 0;

        if (hasNewCompleted) {
            for (const name of newCompletedNames) {
                const availableObjective = availableObjectives.value.find(o => o.objective.name === name);
                if (!availableObjective) throw new Error(`Objective not found: ${name}`);
                add(availableObjective.objective, true);
                useToast().add(`toasts.objectives.titles.${name}`, 4000, 'success');

                if (availableObjective.data.timeline) {
                    await useTimeline().play(availableObjective.data.timeline);
                }
            }

            addNewAvailable();
            PersistentData.set('completed_objectives', completedNamesAfter);
        }
    }

    return {
        init,
        controller,
        tryCompleteIncompletes,
    }
}
