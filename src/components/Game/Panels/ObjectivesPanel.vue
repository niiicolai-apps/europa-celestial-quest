<template>
    <Panel name="objectives" identifier="objectives">
        <UI.Card v-for="objective in objectives" :key="objective.name">
            <template #header>
                <UI.Paragraph class="uppercase">
                    {{ objective.name }}
                </UI.Paragraph>

                <span class="text-xs uppercase p-1 rounded"
                    :class="objective.completed ? 'bg-success text-white' : 'bg-danger text-white'">
                    {{ objective.completed ? 'Completed' : 'Not Completed' }}
                </span>
            </template>

            <template #body>
                <UI.Paragraph class="mb-5">
                    {{ objective.description }}
                </UI.Paragraph>

                <div>
                    <UI.Paragraph class="font-bold mb-1">
                        Goals:
                    </UI.Paragraph>
                    <UI.Flex items="start" justify="start">
                        <UI.Flex v-for="goal in objective.goals" :key="goal.name" direction="horizontal" items="center"
                            justify="between">
                            <UI.Paragraph>
                                {{ goal.name }}
                            </UI.Paragraph>

                            <span class="text-xs uppercase p-1 rounded"
                                :class="goal.completed ? 'bg-success text-white' : 'bg-danger text-white'">
                                {{ goal.completed ? 'Completed' : 'Not Completed' }}
                            </span>
                        </UI.Flex>
                    </UI.Flex>
                </div>
            </template>

            <template #footer>
                <div>
                    <UI.Paragraph class="font-bold mb-1">
                        Rewards:
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
import { computed } from 'vue';
const props = defineProps({
    objectivesManager: {
        type: Object,
        required: true,
    },
})
const objectives = computed(() => props.objectivesManager.controller.value.objectives);
</script>