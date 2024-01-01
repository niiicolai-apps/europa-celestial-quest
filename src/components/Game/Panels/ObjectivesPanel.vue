<template>
    <Panel :name="localizationManager.getLocale('objectives.title')" identifier="objectives" transition_name="slide-up-game" :styling="{top: '12em'}" styling_top="top:6em;">
        <div style="padding-bottom: 6em;">
            <ObjectiveCard v-for="objective in objectives" :key="objective.name" :objective="objective" />
            <div v-if="objectives.length == 0" 
                class="p-5 bg-primary rounded text-center text-info">
                
                <p class="text-lg font-bold mb-5">
                    <Locale id="objectives.no_objectives" />
                </p>

                <Icons.fa.DungeonIcon 
                    :width="iconSize" 
                    :height="iconSize" 
                    :fill="iconFill" 
                />
            </div>
        </div>
    </Panel>
</template>

<script setup>
import Icons from 'frontend-icons';
import Panel from '../../UI/Panel.vue';
import Locale from '../../General/Locale.vue';
import ObjectiveCard from './ObjectiveCard.vue';
import { computed } from 'vue';
import { useObjectives } from '../../../game/objectives/objectives.js';
import { useLocalization } from '../../../composables/localization.js';

const iconSize = "2em";
const iconFill = "#3F88C5";
const objectivesManager = useObjectives({});
const localizationManager = useLocalization();
const objectives = computed(() => objectivesManager.controller.value.findIncomplete());
</script>