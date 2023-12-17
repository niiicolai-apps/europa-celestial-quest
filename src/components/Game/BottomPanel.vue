<template>
    <Transition name="slide-up">
        <UI.Fixed v-if="!selected" top="auto">
            <UI.Flex direction="horizontal" justify="between" gap="3" class="bg-info p-3">
                <Commands />

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('game_menu.shop_button')"
                        :disabled="isSettingCommand"
                        @click="panelManager.setPanel('shop')">
                        <Icons.fa.SpaceAwesomeIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game_menu.objectives_button')"
                        :disabled="isSettingCommand"
                        @click="panelManager.setPanel('objectives')">
                        <Icons.fa.TowerBroadcastIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game_menu.pause_button')"
                        :disabled="isSettingCommand"
                        @click="panelManager.setPanel('pause')">
                        <Icons.fa.PauseIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                    </UI.Button>
                </UI.Flex>

            </UI.Flex>
        </UI.Fixed>
    </Transition>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Commands from './Utils/Commands.vue';
import { computed } from 'vue';
import { useInspect } from '../../managers/inspect.js';
import { useLocalization } from '../../composables/localization.js';
import { usePanel } from '../../composables/panel.js';
import { useCommands } from '../../managers/commands.js';

const panelManager = usePanel();
const localizationManager = useLocalization();
const inspectManager = useInspect();
const commandsManager = useCommands();

const selected = computed(() => inspectManager.selected.value);
const isSettingCommand = computed(() => commandsManager.isSettingCommand.value);

</script>