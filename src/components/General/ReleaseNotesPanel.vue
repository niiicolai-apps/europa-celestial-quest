<template>
    <Panel :name="localizationManager.getLocale('release_notes.title')" identifier="release_notes" :showScroll="true">
        <UI.Flex>
            <UI.Card v-for="note in releaseNotes" :key="note.name" class="w-full">
                <template #header>
                    <UI.Paragraph class="font-bold uppercase">
                        {{ note.name[LANGUAGE] }}
                    </UI.Paragraph>
                </template>

                <template #body>
                    <UI.Paragraph>
                        {{ note.description[LANGUAGE] }}
                    </UI.Paragraph>
                </template>

                <template #footer>
                    <UI.Flex direction="horizontal" gap="1" class="text-dark text-xs">
                        <Locale id="release_notes.published" /> 
                        <span>{{ note.created_at }}</span>
                    </UI.Flex>
                </template>
            </UI.Card>
        </UI.Flex>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Panel from '../UI/Panel.vue';
import Locale from '../Locale.vue';
import { computed } from 'vue';
import { useLocalization } from '../../composables/localization';
const localizationManager = useLocalization();
const LANGUAGE = computed(() => localizationManager.LANGUAGE.value);
const releaseNotes = [{
    name: {
        en: "v0.0.1",
        da: "v0.0.1",
    },
    description: {
        en: "Initial release.",
        da: "Første udgivelse.",
    },
    created_at: "2021-10-10",
}, {
    name: {
        en: "v0.0.2",
        da: "v0.0.2",
    },
    description: {
        en: "Added settings panel.",
        da: "Tilføjet indstillinger panel.",
    },
    created_at: "2021-10-11",
}]
</script>