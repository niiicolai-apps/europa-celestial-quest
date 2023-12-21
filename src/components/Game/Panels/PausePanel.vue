<template>
    <Panel :name="localizationManager.getLocale('pause.title')" identifier="pause">
        <UI.Flex gap="2">
            <div type="primary" v-for="option in options" :key="option.name"
                class="w-full bg-info text-primary border-1 border-solid border-primary p-3 rounded box-shadow-lg">
                <UI.Flex direction="horizontal" justify="between" class="w-full">
                    <p class="font-bold uppercase text-sm">
                        {{ option.name }}
                    </p>

                    <UI.Button v-if="option.link" :title="option.name" :link="option.link" type="primary">
                        <Icons.fa.GearIcon v-if="option.icon === 'gear'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.CrownIcon v-if="option.icon === 'crown'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.ScrollIcon v-if="option.icon === 'scroll'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.DungeonIcon v-if="option.icon === 'dungeon'"
                            :height="optionIconSize" :fill="optionIconFill" />
                    </UI.Button>

                    <UI.Button v-if="option.panel" :title="option.name" @click="panelManager.setPanel(option.panel)" type="primary">
                        <Icons.fa.GearIcon v-if="option.icon === 'gear'" :width="optionIconSize" :height="optionIconSize"
                        :fill="optionIconFill" />

                        <Icons.fa.CrownIcon v-if="option.icon === 'crown'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.ScrollIcon v-if="option.icon === 'scroll'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.DungeonIcon v-if="option.icon === 'dungeon'"
                            :height="optionIconSize" :fill="optionIconFill" />
                    </UI.Button>

                    <UI.Button v-if="option.method" :title="option.name" @click="option.method" type="primary">
                        <Icons.fa.GearIcon v-if="option.icon === 'gear'" :width="optionIconSize" :height="optionIconSize"
                        :fill="optionIconFill" />

                        <Icons.fa.CrownIcon v-if="option.icon === 'crown'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.ScrollIcon v-if="option.icon === 'scroll'" :width="optionIconSize" :height="optionIconSize"
                            :fill="optionIconFill" />

                        <Icons.fa.DungeonIcon v-if="option.icon === 'dungeon'" :width="optionIconSize"
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
import { useTutorial } from '../../../composables/tutorial.js';
import { computed } from 'vue';

const props = defineProps({
    endGame: {
        type: Function,
        required: true,
    }
})

const panelManager = usePanel();
const localizationManager = useLocalization();
const tutorialManager = useTutorial();
const replayStartTutorial = () => {
    tutorialManager.replay("start_tutorial");
    panelManager.clearPanel();
}

const optionIconSize = "1em";
const optionIconFill = "#3f88c5";
const options = computed(() => [{
    name: localizationManager.getLocale("pause.settings_button_title"),
    description: localizationManager.getLocale("pause.settings_button_description"),
    icon: "gear",
    panel: "settings",
}, {
    name: localizationManager.getLocale("pause.replay.title"),
    description: localizationManager.getLocale("pause.replay.description"),
    icon: "scroll",
    method: replayStartTutorial,
}, {
    name: localizationManager.getLocale("pause.quit_button_title"),
    description: localizationManager.getLocale("pause.quit_button_description"),
    icon: "dungeon",
    method: props.endGame,
}]);
</script>