<template>
    <Panel :name="localizationManager.getLocale('objectives.title')" identifier="objectives">
        <ObjectiveCard v-for="objective in objectives" :key="objective.name" :objective="objective" />
    </Panel>
</template>

<script setup>
import Panel from '../../UI/Panel.vue';
import ObjectiveCard from './ObjectiveCard.vue';
import { computed } from 'vue';
import { useObjectives } from '../../../managers/objectives.js';
import { useLocalization } from '../../../composables/localization.js';

const objectivesManager = useObjectives({});
const localizationManager = useLocalization();
const objectives = computed(() => objectivesManager.controller.value.findIncomplete());
</script>