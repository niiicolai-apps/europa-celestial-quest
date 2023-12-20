<template>
    <Transition name="slide-up">
        <UI.Fixed v-if="!selected" top="auto">
            <UI.Flex direction="horizontal" justify="between" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">
                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button
                        :disabled="isSettingCommand"
                        @click="panelManager.setPanel('shop')" class="h-15 w-17">
                        <Icons.fa.SpaceAwesomeIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="game_menu.shop_button" />
                        </p>
                    </UI.Button>

                    <UI.Button
                        :disabled="isSettingCommand"
                        @click="panelManager.setPanel('objectives')" class="h-15 w-17">
                        <Icons.fa.TowerBroadcastIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="game_menu.objectives_button" />
                        </p>
                    </UI.Button>

                    <UI.Button
                        :disabled="isSettingCommand"
                        @click="panelManager.setPanel('pause')" class="h-15 w-17">
                        <Icons.fa.PauseIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
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
import { useLocalization } from '../../composables/localization.js';
import { usePanel } from '../../composables/panel.js';
import { useCommands } from '../../game/units/commands.js';

const panelManager = usePanel();
const localizationManager = useLocalization();
const inspectManager = useInspect();
const commandsManager = useCommands();

const selected = computed(() => inspectManager.selected.value);
const isSettingCommand = computed(() => commandsManager.isSettingCommand.value);

</script>