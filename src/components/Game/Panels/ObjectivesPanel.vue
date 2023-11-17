<template>
    <Panel :name="localizationManager.getLocale('objectives.title')" identifier="objectives">
        <UI.Card v-for="objective in objectives" :key="objective.name">
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
                    <UI.Paragraph class="font-bold mb-1">
                        <Locale id="objectives.goals" />:
                    </UI.Paragraph>
                    <UI.Flex items="start" justify="start">
                        <UI.Flex v-for="goal in objective.goals" :key="goal.name" direction="horizontal" items="center"
                            justify="between">
                            <UI.Paragraph>
                                {{ goal.name }}
                            </UI.Paragraph>

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
                    <UI.Paragraph class="font-bold mb-1">
                        <Locale id="objectives.rewards" />:
                    </UI.Paragraph>
                    <UI.Flex items="start" justify="start">
                        <UI.Flex v-for="reward in objective.rewards" :key="reward.name" direction="horizontal"
                            items="center" justify="between">
                            <UI.Paragraph>
                                {{ reward.name }}
                            </UI.Paragraph>
                        </UI.Flex>
                    </UI.Flex>
                </div>
            </template>
        </UI.Card>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Panel from '../../UI/Panel.vue';
import Locale from '../../Locale.vue';
import { computed } from 'vue';
import { useLocalization } from '../../../composables/localization.js';
const props = defineProps({
    objectivesManager: {
        type: Object,
        required: true,
    },
})
const localizationManager = useLocalization();
const objectives = computed(() => props.objectivesManager.controller.value.objectives);

</script>