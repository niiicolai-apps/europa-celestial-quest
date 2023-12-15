<template>
    <Transition name="slide-up">
        <UI.Fixed v-if="!selected" top="auto">
            <UI.Flex direction="horizontal" justify="between" gap="3" class="bg-info p-3">
                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('game_menu.warrior.regroup_button')"
                        @click="toggleWarriorCommand('regroup')"
                        :disabled="isSettingWarriorCommand && warriorCommand && warriorCommand.type !== 'regroup'"
                        :type="isSettingWarriorCommand && warriorCommand && warriorCommand.type === 'regroup' ? 'warning' : 'primary'">
                        <Icons.fa.ShieldIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game_menu.warrior.attack_button')"
                        @click="toggleWarriorCommand('attack')"
                        :disabled="isSettingWarriorCommand && warriorCommand && warriorCommand.type !== 'attack'"
                        :type="isSettingWarriorCommand && warriorCommand && warriorCommand.type === 'attack' ? 'warning' : 'primary'">
                        <Icons.fa.SkullCrossbonesIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                    </UI.Button>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('game_menu.shop_button')"
                        :disabled="isSettingWarriorCommand"
                        @click="panelManager.setPanel('shop')">
                        <Icons.fa.ShopIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game_menu.objectives_button')"
                        :disabled="isSettingWarriorCommand"
                        @click="panelManager.setPanel('objectives')">
                        <Icons.fa.ScrollIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game_menu.pause_button')"
                        :disabled="isSettingWarriorCommand"
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
import { computed } from 'vue';
import { useInspect } from '../../composables/inspect.js';
import { useLocalization } from '../../composables/localization.js';
import { usePanel } from '../../composables/panel.js';
import { useUnits } from '../../composables/units.js';

const panelManager = usePanel();
const localizationManager = useLocalization();
const inspectManager = useInspect();
const selected = computed(() => inspectManager.selected.value);
const unitsManager = useUnits();
const warriorCommand = computed(() => unitsManager.getCommand('player'));
const isSettingWarriorCommand = computed(() => unitsManager.isSettingWarriorCommand.value);
const toggleWarriorCommand = (type) => {
    if (isSettingWarriorCommand.value)
        unitsManager.stopTrackWarriorCommand()
    else
        unitsManager.startTrackWarriorCommand(type);
}
</script>