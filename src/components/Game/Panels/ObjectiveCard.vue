<template>
    <div type="info" class="mb-3 bg-info text-primary border-1 border-solid border-primary rounded w-full p-2 box-shadow-lg">
        <p class="uppercase text-primary font-bold text-sm mb-1">
            <Locale :id="`objectives.implemented.${objective.name}.title`" />
        </p>

        <div class="text-sm mb-3">
            <Locale :id="`objectives.implemented.${objective.name}.description`" />
        </div>

        <div class="mb-3">
            <div class="text-sm font-bold mb-1">
                <Locale id="objectives.goals" />
            </div>

            <UI.Flex items="start" justify="start" gap="3" class="bg-primary text-info rounded p-3">
                <UI.Flex v-for="goal in objective.goals" :key="goal.name" direction="horizontal" items="center"
                    justify="between" gap="1" class="w-full">
                    <UI.Flex direction="horizontal" justify="start" gap="3" class="w-50 text-xs">
                        <span>-</span>
                        <span>
                            <Locale :id="`objectives.implemented.${objective.name}.goals.${goal.name}`" />
                        </span>
                    </UI.Flex>

                    <UI.Flex direction="horizontal" gap="1" class="text-xs text-info uppercase p-1 rounded w-65"
                        :class="goal.completed ? 'bg-success' : 'bg-primary'">
                        <Icons.fa.CheckmarkIcon v-if="goal.completed" width="1em" height="1em" fill="#3f88c5" />
                        <Icons.fa.TimesIcon v-else width="1em" height="1em" fill="#3f88c5" />
                        {{ goal.completed
                            ? localizationManager.getLocale('objectives.completed')
                            : localizationManager.getLocale('objectives.not_completed') }}
                    </UI.Flex>
                </UI.Flex>
            </UI.Flex>
        </div>

        <div>
            <div class="text-sm font-bold mb-1">
                <Locale id="objectives.rewards" />
            </div>

            <UI.Flex items="start" justify="start" gap="3" class="bg-primary text-info rounded p-3">
                <UI.Flex v-for="reward in objective.rewards" :key="reward.name" direction="horizontal" items="center"
                    justify="between">
                    <UI.Flex direction="horizontal" justify="start" gap="3" class="w-50 text-xs">
                        <span>-</span>
                        <span>
                            <Locale :id="`objectives.implemented.${objective.name}.rewards.${reward.name}`" />
                        </span>
                    </UI.Flex>
                </UI.Flex>
            </UI.Flex>
        </div>

    </div>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../../General/Locale.vue';
import { useLocalization } from '../../../composables/localization.js';
const localizationManager = useLocalization();
defineProps({
    objective: {
        type: Object,
        required: true
    }
})
</script>