<template>
    <Panel :name="localizationManager.getLocale('release_notes.title')" identifier="release_notes">
        <UI.Flex>
            <div v-for="note in releaseNotes" :key="note.name" type="primary"
                class="bg-info text-primary w-full rounded box-shadow-lg p-3 border-1 border-solid border-primary">
                <UI.Paragraph class="font-bold uppercase mb-3">
                    {{ note.name[LANGUAGE] }}
                </UI.Paragraph>

                <UI.Paragraph class="mb-3">
                    {{ note.description[LANGUAGE] }}
                </UI.Paragraph>

                <UI.Flex gap="2" items="start" justify="start" class="mb-3">
                    <div v-for="feature in note.features_list" :key="feature.en">

                        <UI.Flex direction="horizontal" gap="1" justify="start" class="font-bold text-xs">
                            <span>-</span>
                            <span>{{ feature[LANGUAGE] }}</span>
                        </UI.Flex>
                    </div>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1" class="text-xs">
                    <Locale id="release_notes.published" />
                    <span>{{ note.created_at }}</span>
                </UI.Flex>
            </div>
        </UI.Flex>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Panel from '../UI/Panel.vue';
import Locale from './Locale.vue';
import { computed } from 'vue';
import { useLocalization } from '../../composables/localization';
const localizationManager = useLocalization();
const LANGUAGE = computed(() => localizationManager.LANGUAGE.value);
const releaseNotes = [{
    name: {
        en: "v.0.0.1 - Arrival",
        da: "v.0.0.1 - Ankomst",
    },
    description: {
        en: "The first release of the game.",
        da: "Den første udgivelse af spillet.",
    },
    features_list: [
        {
            en: "Added Intro Cutscene",
            da: "Tilføjet intro cutscene",
        },
        {
            en: "Added lanuages: English; Danish;",
            da: "Tilføjet sprog: Engelsk; Dansk;",
        },
        {
            en: "Added Resources: Ice; Rock; Metal; Hydrogen; Power; Research;",
            da: "Tilføjet seks forskellige ressourcer: Is; Sten; Metal; Hydrogen; Strøm; Forskning;",
        },
        {
            en: "Added 9 different buildings",
            da: "Tilføjet 9 forskellige bygninger",
        },
        {
            en: "Added 9 different units",
            da: "Tilføjet 9 forskellige enheder",
        },
        {
            en: "Added 1 map",
            da: "Tilføjet 1 kort",
        },
        {
            en: "Added 8 objectives",
            da: "Tilføjet 8 mål",
        },
        
    ],
    created_at: "2021-10-10",
}]
</script>