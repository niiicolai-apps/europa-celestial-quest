<template>
    <Panel :name="localizationManager.getLocale('settings.title')" identifier="settings" :showScroll="true">
        <UI.Flex>
            <UI.Card 
                v-for="setting in settings" 
                :key="setting.name"
                class="w-full"
                >
                <template #header>
                    <UI.Paragraph class="font-bold uppercase">
                        {{ setting.name }}
                    </UI.Paragraph>
                </template>

                <template #body>
                    <UI.Flex direction="horizontal" justify="between">
                        <UI.Paragraph>
                            {{ setting.description }}
                        </UI.Paragraph>

                        <div>
                            Not implemented yet.
                        </div>
                    </UI.Flex>
                </template>

                <template #footer>
                    <UI.Button type="primary">
                        <UI.Flex direction="horizontal" justify="between">
                            <UI.Paragraph class="font-bold">
                                <Locale id="settings.save_button" />
                            </UI.Paragraph>
                            <Icons.fa.CheckmarkIcon 
                                width="1em" 
                                height="1em" 
                                fill="white" 
                            />
                        </UI.Flex>
                    </UI.Button>
                </template>
            </UI.Card>
        </UI.Flex>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Panel from '../UI/Panel.vue';
import Locale from '../Locale.vue';
import { computed } from 'vue';
import { useLocalization } from '../../composables/localization';
const localizationManager = useLocalization();
const settings = computed(() => {
    return [{
        name: localizationManager.getLocale("settings.camera_zoom_speed_title"),
        description: localizationManager.getLocale("settings.camera_zoom_speed_description"),
    }, {
        name: localizationManager.getLocale("settings.camera_pan_speed_title"),
        description: localizationManager.getLocale("settings.camera_pan_speed_description"),
    }]
})
</script>