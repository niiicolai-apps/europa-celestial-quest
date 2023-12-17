<template>
    <UI.Flex direction="horizontal" justify="start" gap="1">
        <UI.Button :title="localizationManager.getLocale('game_menu.warrior.regroup_button')"
            @click="toggleWarriorCommand('regroup')"
            :disabled="isSettingCommand && !isGrouping"
            :type="isSettingCommand && isGrouping ? 'warning' : 'primary'">
            <Icons.fa.ShieldIcon width="1.5em" height="1.5em" fill="#3f88c5" />
        </UI.Button>

        <UI.Button :title="localizationManager.getLocale('game_menu.warrior.attack_button')"
            @click="toggleWarriorCommand('attack')"
            :disabled="isSettingCommand && !isAttacking"
            :type="isSettingCommand && isAttacking ? 'warning' : 'primary'">
            <Icons.fa.SkullCrossbonesIcon width="1.5em" height="1.5em" fill="#3f88c5" />
        </UI.Button>
    </UI.Flex>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import { useLocalization } from '../../../composables/localization.js';
import { useCommands } from '../../../managers/commands.js';
import { computed } from 'vue';

const localizationManager = useLocalization();
const commandsManager = useCommands();

const isSettingCommand = computed(() => commandsManager.isSettingCommand.value);
const command = computed(() => commandsManager.getCommandYou());

const isGrouping = computed(() => command.value && command.value.type === 'group');
const isAttacking = computed(() => command.value && command.value.type === 'attack');

const toggleWarriorCommand = (type) => {
    const positionTracker = commandsManager.PositionTracker();
    if (isSettingCommand.value) positionTracker.stopTrackCommandPosition()
    else positionTracker.startTrackCommandPositionYou(type);
}
</script>