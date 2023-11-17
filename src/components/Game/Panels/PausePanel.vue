<template>
    <Panel :name="localizationManager.getLocale('pause.title')" identifier="pause">
        <UI.Flex>
            <UI.Card v-for="option in options" :key="option.name" class="w-full">
                <template #header>
                    <UI.Paragraph class="font-bold uppercase">
                        {{ option.name }}
                    </UI.Paragraph>

                    <Icons.fa.GearIcon 
                        v-if="option.icon === 'gear'"
                        :width="optionIconSize" 
                        :height="optionIconSize" 
                        :fill="optionIconFill" 
                    />

                    <Icons.fa.CrownIcon 
                        v-if="option.icon === 'crown'"
                        :width="optionIconSize" 
                        :height="optionIconSize" 
                        :fill="optionIconFill"
                    />

                    <Icons.fa.ScrollIcon 
                        v-if="option.icon === 'scroll'"
                        :width="optionIconSize" 
                        :height="optionIconSize" 
                        :fill="optionIconFill"
                    />

                    <Icons.fa.ArrowRightIcon 
                        v-if="option.icon === 'arrow-right'"
                        :width="optionIconSize" 
                        :height="optionIconSize" 
                        :fill="optionIconFill"
                    />
                </template>

                <template #body>
                    <UI.Flex direction="horizontal" justify="between" class="w-full">
                        <UI.Paragraph>
                            {{ option.description }}
                        </UI.Paragraph>

                        <UI.Button v-if="option.link" :title="option.name" :link="option.link">
                            <Icons.fa.ArrowRightIcon 
                                width="1em" 
                                height="1em" 
                                fill="white" 
                            />
                        </UI.Button>

                        <UI.Button v-if="option.panel" :title="option.name" @click="panelManager.setPanel(option.panel)">
                            <Icons.fa.ArrowRightIcon 
                                width="1em" 
                                height="1em" 
                                fill="white" 
                            />
                        </UI.Button>
                    </UI.Flex>
                </template>
            </UI.Card>
        </UI.Flex>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Panel from '../../UI/Panel.vue';
import { usePanel } from '../../../composables/panel.js';
import { useLocalization } from '../../../composables/localization.js';

const panelManager = usePanel();
const localizationManager = useLocalization();

const optionIconSize = "1em";
const optionIconFill = "black";
const options = [{
    name: localizationManager.getLocale("pause.settings_button_title"),
    description: localizationManager.getLocale("pause.settings_button_description"),
    icon: "gear",
    panel: "settings",
}, {
    name: localizationManager.getLocale("pause.leaderboard_button_title"),
    description: localizationManager.getLocale("pause.leaderboard_button_description"),
    icon: "crown",
}, {
    name: localizationManager.getLocale("pause.achievements_button_title"),
    description: localizationManager.getLocale("pause.achievements_button_description"),
    icon: "scroll",
}, {
    name: localizationManager.getLocale("pause.quit_button_title"),
    description: localizationManager.getLocale("pause.quit_button_description"),
    icon: "arrow-right",
    link: "/",
}]
</script>