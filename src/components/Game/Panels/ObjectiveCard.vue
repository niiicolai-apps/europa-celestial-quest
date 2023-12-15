<template>
    <UI.Card class="mb-3" type="primary">
        <template #header>
            <UI.Paragraph class="text-info uppercase">
                {{ objective.name }}
            </UI.Paragraph>
        </template>

        <template #body>
            <div class="text-info text-sm mb-5">
                {{ objective.description }}
            </div>

            <div>
                <div class="text-info text-sm font-bold mb-3">
                    <Locale id="objectives.goals" />:
                </div>

                <UI.Flex items="start" justify="start" gap="1">
                    <UI.Flex 
                        v-for="goal in objective.goals" 
                        :key="goal.name" 
                        direction="horizontal" 
                        items="center"
                        justify="between" 
                        gap="1"
                        class="w-full">
                        <UI.Flex direction="horizontal" justify="start" gap="3" class="w-50 text-info text-xs">
                            <span>-</span>
                            <span>{{ goal.name }}</span>
                        </UI.Flex>

                        <UI.Flex direction="horizontal" 
                            gap="1" 
                            class="text-xs text-primary uppercase p-1 rounded w-65"
                            :class="goal.completed ? 'bg-success' : 'bg-info'">
                            <Icons.fa.CheckmarkIcon v-if="goal.completed" width="1em" height="1em" fill="#3f88c5" />
                            <Icons.fa.TimesIcon v-else width="1em" height="1em" fill="#1c3144" />
                            {{ goal.completed
                                ? localizationManager.getLocale('objectives.completed')
                                : localizationManager.getLocale('objectives.not_completed') }}
                        </UI.Flex>
                    </UI.Flex>
                </UI.Flex>
            </div>
        </template>

        <template #footer>
            <div>
                <div class="text-info text-sm font-bold mb-3">
                    <Locale id="objectives.rewards" />:
                </div>

                <UI.Flex items="start" justify="start" gap="1">
                    <UI.Flex 
                        v-for="reward in objective.rewards" 
                        :key="reward.name" 
                        direction="horizontal" 
                        items="center"
                        justify="between">
                        <UI.Flex direction="horizontal" justify="start" gap="3" class="w-50 text-info text-xs">
                            <span>-</span>
                            <span>{{ reward.name }}</span>
                        </UI.Flex>
                    </UI.Flex>
                </UI.Flex>
            </div>
        </template>
    </UI.Card>
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