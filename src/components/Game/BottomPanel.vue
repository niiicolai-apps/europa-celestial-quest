<template>
    <Transition name="slide-up">
        <UI.Fixed v-if="!selected" top="auto">
            <UI.Flex direction="horizontal" justify="between" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">
                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button
                        :disabled="isSettingCommand"
                        @click="panelManager.setPanel('shop')" class="h-15">
                        <Icons.fa.SpaceAwesomeIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold bottom-panel-btn-text">
                            <Locale id="game_menu.shop_button" />
                        </p>
                    </UI.Button>

                    <UI.Button
                        :disabled="isSettingCommand"
                        @click="panelManager.setPanel('objectives')" class="h-15">
                        <Icons.fa.TowerBroadcastIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold bottom-panel-btn-text">
                            <Locale id="game_menu.objectives_button" />
                        </p>
                    </UI.Button>

                    <UI.Button
                        :disabled="isSettingCommand"
                        @click="panelManager.setPanel('pause')" class="h-15">
                        <Icons.fa.PauseIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold bottom-panel-btn-text">
                            <Locale id="game_menu.pause_button" />
                        </p>
                    </UI.Button>
                </UI.Flex>

                <Commands />
            </UI.Flex>
        </UI.Fixed>
    </Transition>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../General/Locale.vue';
import Commands from './Utils/Commands.vue';
import { computed } from 'vue';
import { useInspect } from '../../game/inspect/inspect.js';
import { usePanel } from '../../composables/panel.js';
import { useCommands } from '../../game/units/commands.js';

const iconSize = "1.5em";
const iconFill = "#3f88c5";

const panelManager = usePanel();
const inspectManager = useInspect();
const commandsManager = useCommands();

const selected = computed(() => inspectManager.selected.value);
const isSettingCommand = computed(() => commandsManager.isSettingCommand.value);

</script>

<style scoped>
.bottom-panel-btn-text {
    font-size: 0.7em;
}
</style>