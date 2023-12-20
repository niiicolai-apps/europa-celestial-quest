<template>
    <UI.Flex direction="horizontal" justify="start" gap="1">
        <UI.Button
            @click="toggleWarriorCommand('regroup')" :disabled="isSettingCommand && !isGrouping"
            :type="regroupBtnClasses" class="h-15 w-17">
            <Icons.fa.ShieldIcon width="1.5em" height="1.5em" fill="#3f88c5" />
            <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                <Locale id="game_menu.warrior.regroup_button" />
            </p>
        </UI.Button>

        <UI.Button
            @click="toggleWarriorCommand('attack')" :disabled="isSettingCommand && !isAttacking"
            :type="attackBtnClasses" class="h-15 w-17">
            <Icons.fa.SkullCrossbonesIcon width="1.5em" height="1.5em" fill="#3f88c5" />
            <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                <Locale id="game_menu.warrior.attack_button" />
            </p>
        </UI.Button>
    </UI.Flex>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../../General/Locale.vue';
import { useLocalization } from '../../../composables/localization.js';
import { useCommands } from '../../../game/units/commands.js';
import { computed } from 'vue';

const localizationManager = useLocalization();
const commandsManager = useCommands();

const isSettingCommand = computed(() => commandsManager.isSettingCommand.value);
const command = computed(() => commandsManager.getCommandYou());

const type = computed(() => command.value ? command.value.type : null);
const isGrouping = computed(() => command.value && command.value.type === 'regroup');
const regroupBtnClasses = computed(() => {
    if (isSettingCommand.value && isGrouping.value) return 'dark';
    else if (isGrouping.value) return 'warning';
    else return 'primary';
})
const attackBtnClasses = computed(() => {
    if (isSettingCommand.value && isAttacking.value) return 'dark';
    else if (isAttacking.value) return 'warning';
    else return 'primary';
})

const isAttacking = computed(() => command.value && command.value.type === 'attack');



const toggleWarriorCommand = (type) => {
    const positionTracker = commandsManager.PositionTracker();
    if (isSettingCommand.value) positionTracker.stopTrackCommandPosition()
    else positionTracker.startTrackCommandPositionYou(type);
}
</script>