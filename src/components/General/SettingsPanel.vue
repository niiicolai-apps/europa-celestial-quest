<template>
    <Panel :name="localizationManager.getLocale('settings.title')" identifier="settings" :showScroll="true">
        <UI.Flex>
            <div v-for="setting in settings" :key="setting.name"
                class="w-full bg-primary text-info rounded p-3 box-shadow-lg">

                <UI.Flex direction="horizontal" items="start" justify="between">
                    <div>
                        <UI.Paragraph class="font-bold uppercase mb-3">
                            {{ setting.name }}
                        </UI.Paragraph>

                        <UI.Paragraph>
                            {{ setting.description }}
                        </UI.Paragraph>
                    </div>

                    <div v-if="setting.list">
                        <UI.Select type="info" :options="setting.list" :startOption="setting.listStartOption"
                            @update:value="setting.listUpdate" />
                    </div>
                </UI.Flex>
            </div>

        </UI.Flex>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Panel from '../UI/Panel.vue';
import { ref, computed, onMounted } from 'vue';
import { useLocalization } from '../../composables/localization.js';
import PersistentData from '../../composables/persistent_data.js';

const localizationManager = useLocalization();
const startLanguageOption = ref(null);

const settings = computed(() => {
    return [{
        name: localizationManager.getLocale("settings.camera_zoom_speed_title"),
        description: localizationManager.getLocale("settings.camera_zoom_speed_description"),
    }, {
        name: localizationManager.getLocale("settings.camera_pan_speed_title"),
        description: localizationManager.getLocale("settings.camera_pan_speed_description"),
    }, {
        name: localizationManager.getLocale("settings.language.title"),
        description: localizationManager.getLocale("settings.language.description"),
        list: Object.values(localizationManager.LANGUAGE_TYPES).map(l => { return { label: l, value: l } }),
        listStartOption: { label: startLanguageOption, value: startLanguageOption },
        listUpdate: (option) => {
            localizationManager.setLanguage(option.value);
        }
    }]
})

onMounted(async () => {
    const pd = await PersistentData.get('language');
    const pdLanguage = pd.lang || localizationManager.LANGUAGE.value;
    startLanguageOption.value = pdLanguage;
    localizationManager.setLanguage(pdLanguage);
});
</script>