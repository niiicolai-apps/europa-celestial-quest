<template>
    <UI.Card class="mb-3">
        <template #header>
            <UI.Paragraph class="uppercase">
                {{ objective.name }}
            </UI.Paragraph>

            <span class="text-xs uppercase p-1 rounded"
                :class="objective.completed ? 'bg-success text-white' : 'bg-danger text-white'">
                {{ objective.completed
                    ? localizationManager.getLocale('objectives.completed')
                    : localizationManager.getLocale('objectives.not_completed') }}
            </span>
        </template>

        <template #body>
            <UI.Paragraph class="mb-5">
                {{ objective.description }}
            </UI.Paragraph>

            <div>
                <UI.Paragraph class="font-bold mb-3">
                    <Locale id="objectives.goals" />:
                </UI.Paragraph>
                <UI.Flex items="start" justify="start" gap="1">
                    <UI.Flex v-for="goal in objective.goals" :key="goal.name" direction="horizontal" items="center"
                        justify="between" class="w-full">
                        <UI.Flex direction="horizontal" gap="1">
                            <span>-</span>
                            <span>{{ goal.name }}</span>
                        </UI.Flex>

                        <span class="text-xs uppercase p-1 rounded"
                            :class="goal.completed ? 'bg-success text-white' : 'bg-danger text-white'">
                            {{ goal.completed
                                ? localizationManager.getLocale('objectives.completed')
                                : localizationManager.getLocale('objectives.not_completed') }}
                        </span>
                    </UI.Flex>
                </UI.Flex>
            </div>
        </template>

        <template #footer>
            <div>
                <UI.Paragraph class="font-bold mb-3">
                    <Locale id="objectives.rewards" />:
                </UI.Paragraph>
                <UI.Flex items="start" justify="start" gap="1">
                    <UI.Flex v-for="reward in objective.rewards" :key="reward.name" direction="horizontal" items="center"
                        justify="between">
                        <UI.Paragraph>
                            {{ reward.name }}
                        </UI.Paragraph>
                    </UI.Flex>
                </UI.Flex>
            </div>
        </template>
    </UI.Card>
</template>

<script setup>
import UI from 'frontend-ui';
import Locale from '../../Locale.vue';
import { useLocalization } from '../../../composables/localization.js';
const localizationManager = useLocalization();
defineProps({
    objective: {
        type: Object,
        required: true
    }
})
</script>