<template>
    <Panel :name="localizationManager.getLocale('settings.title')" identifier="settings">
        <UI.Flex>
            <div v-for="setting in settings" :key="setting.name"
                class="w-full bg-info border-1 border-solid border-primary text-primary rounded p-3 box-shadow-lg">

                <UI.Flex direction="horizontal" items="start" justify="between">
                    <div>
                        <UI.Paragraph class="font-bold uppercase mb-3">
                            {{ setting.name }}
                        </UI.Paragraph>

                        <UI.Paragraph>
                            {{ setting.description }}
                        </UI.Paragraph>
                    </div>

                    <div v-if="setting.button">
                        <UI.Button type="primary" @click="setting.button.action" class="w-33 h-11">
                            {{ setting.button.label }}
                        </UI.Button>
                    </div>

                    <div v-if="setting.list">
                        <UI.Select type="primary" :options="setting.list" :startOption="setting.listStartOption"
                            @update:value="setting.listUpdate" class="w-33" />
                    </div>

                    <div v-if="setting.range">
                        <UI.Input 
                            type="range" 
                            :min="setting.range.min" 
                            :max="setting.range.max"
                            :step="setting.range.step" 
                            :startValue="setting.range.startValue"
                            @update:value="setting.rangeUpdate"
                            style="padding:0;" 
                        />

                        <UI.Flex direction="horizontal" justify="between" class="mt-3">
                            <div class="text-xs font-bold">
                                {{ setting.range.min }}
                            </div>
                            <div class="text-xs font-bold">
                                {{ setting.range.max }}
                            </div>
                        </UI.Flex>
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
import PersistentData from '../../game/persistent_data/persistent_data.js';
import Camera from '../../game/camera/camera.js';

const localizationManager = useLocalization();

const defaultLanguage = localizationManager.LANGUAGE_TYPES.ENGLISH;
const defaultZoomSpeed = 5;
const defaultMoveSpeed = 0.1;

const startZoomSpeed = ref(defaultZoomSpeed);
const startMoveSpeed = ref(defaultMoveSpeed);
const startLanguageOption = ref({ label: defaultLanguage, value: defaultLanguage });

const settings = computed(() => {
    return [{
        name: localizationManager.getLocale("settings.reset.title"),
        description: localizationManager.getLocale("settings.reset.description"),
        button: {
            label: localizationManager.getLocale("settings.reset.button"),
            action: () => {
                localizationManager.setLanguage(defaultLanguage);
                Camera.setZoomSpeed(defaultZoomSpeed);
                Camera.setMoveSpeed(defaultMoveSpeed);

                startLanguageOption.value = { label: defaultLanguage, value: defaultLanguage };
                startZoomSpeed.value = defaultZoomSpeed;
                startMoveSpeed.value = defaultMoveSpeed;
            }
        }
    }, {
        name: localizationManager.getLocale("settings.language.title"),
        description: localizationManager.getLocale("settings.language.description"),
        list: Object.values(localizationManager.LANGUAGE_TYPES).map(l => { return { label: l, value: l } }),
        listStartOption: startLanguageOption,
        listUpdate: (option) => {
            localizationManager.setLanguage(option.value);
        }
    }, {
        name: localizationManager.getLocale("settings.camera_zoom_speed_title"),
        description: localizationManager.getLocale("settings.camera_zoom_speed_description"),
        range: { min: 1, max: 15, step: 0.5, startValue: startZoomSpeed },
        rangeUpdate: async (value) => {
            await Camera.setZoomSpeed(value);
        }
    }, {
        name: localizationManager.getLocale("settings.camera_pan_speed_title"),
        description: localizationManager.getLocale("settings.camera_pan_speed_description"),
        range: { min: 0.01, max: 5, step: 0.01, startValue: startMoveSpeed },
        rangeUpdate: async (value) => {
            await Camera.setMoveSpeed(value);
        }
    }]
})

onMounted(async () => {
    const pdLanguage = await PersistentData.get('language');
    if (pdLanguage) {
        const language = pdLanguage.lang;
        startLanguageOption.value = { label: language, value: language };
        localizationManager.setLanguage(language);
    }

    const pdZoomSpeed = await PersistentData.get('camera_zoom_speed');
    if (pdZoomSpeed) {
        startZoomSpeed.value = pdZoomSpeed.value;
    }

    const pdMoveSpeed = await PersistentData.get('camera_move_speed');
    if (pdMoveSpeed) {
        startMoveSpeed.value = pdMoveSpeed.value;
    }
});
</script>