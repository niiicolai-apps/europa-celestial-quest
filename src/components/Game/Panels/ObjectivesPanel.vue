<template>
    <UI.Panel transition_name="slide-up" :show="selectedPanel === 'objectives'">
        <div class="bg-white rounded w-full h-screen">
            <div class="p-5 bg-primary flex items-center justify-start gap-3">
                <UI.Button type="danger" class="flex items-center justify-center" @click="setPanel('')">
                    <Icons.fa.ArrowDownIcon width="1em" height="1em" fill="white" />
                </UI.Button>
                <UI.SubTitle class="uppercase text-white">
                    Objectives
                </UI.SubTitle>
            </div>

            <div class="p-5">
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
                                <UI.Flex v-for="goal in objective.goals" :key="goal.name" direction="horizontal"
                                    items="center" justify="between">
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
            </div>
        </div>
    </UI.Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import { computed } from 'vue';
const props = defineProps({
    selectedPanel: {
        type: String,
        required: true,
    },
    setPanel: {
        type: Function,
        required: true,
    },
    objectivesManager: {
        type: Object,
        required: true,
    },
})
const objectives = computed(() => props.objectivesManager.controller.value.objectives);
</script>