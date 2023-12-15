<template>
    <Panel :name="localizationManager.getLocale('pause.title')" identifier="pause">
        <UI.Flex gap="2">
            <div type="primary" v-for="option in options" :key="option.name"
                class="w-full bg-primary p-3 rounded box-shadow-lg">
                <UI.Flex direction="horizontal" justify="between" class="w-full">
                    <UI.Paragraph class="text-info font-bold">
                        {{ option.name }}
                    </UI.Paragraph>

                    <UI.Button v-if="option.link" :title="option.name" :link="option.link" type="info">
                        <Icons.fa.GearIcon v-if="option.icon === 'gear'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.CrownIcon v-if="option.icon === 'crown'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.ScrollIcon v-if="option.icon === 'scroll'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.ArrowRightIcon v-if="option.icon === 'arrow-right'" :width="optionIconSize"
                            :height="optionIconSize" :fill="optionIconFill" />
                    </UI.Button>

                    <UI.Button v-if="option.panel" :title="option.name" @click="panelManager.setPanel(option.panel)"
                        type="info">
                        <Icons.fa.GearIcon v-if="option.icon === 'gear'" :width="optionIconSize" :height="optionIconSize"
                        :fill="optionIconFill" />

                        <Icons.fa.CrownIcon v-if="option.icon === 'crown'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.ScrollIcon v-if="option.icon === 'scroll'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.ArrowRightIcon v-if="option.icon === 'arrow-right'" :width="optionIconSize"
                            :height="optionIconSize" :fill="optionIconFill" />
                    </UI.Button>
                </UI.Flex>
            </div>
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
const optionIconFill = "#1c3144";
const options = [{
    name: localizationManager.getLocale("pause.settings_button_title"),
    description: localizationManager.getLocale("pause.settings_button_description"),
    icon: "gear",
    panel: "settings",
}, {
    name: localizationManager.getLocale("pause.quit_button_title"),
    description: localizationManager.getLocale("pause.quit_button_description"),
    icon: "arrow-right",
    link: "/",
}]
</script>