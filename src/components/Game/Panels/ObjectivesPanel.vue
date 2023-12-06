<template>
    <Panel :name="localizationManager.getLocale('objectives.title')" identifier="objectives">
        <ObjectiveCard v-for="objective in objectives" :key="objective.name" :objective="objective" />
    </Panel>
</template>

<script setup>
import Panel from '../../UI/Panel.vue';
import ObjectiveCard from './ObjectiveCard.vue';
import { computed } from 'vue';
import { useLocalization } from '../../../composables/localization.js';
const props = defineProps({
    objectivesManager: {
        type: Object,
        required: true,
    },
})
const localizationManager = useLocalization();
const objectives = computed(() =>props.objectivesManager.controller.value.findIncomplete());

</script>