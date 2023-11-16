<template>
    <Transition name="slide-up">
        <UI.Fixed v-if="selected && !isMoving && !isSelling" top="auto" left="1" right="1" bottom="1">
            <UI.Flex items="start" gap="3">
                <UI.Paragraph class="font-bold text-white">
                    {{ selected.name }}
                </UI.Paragraph>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.start_move_button')"
                        @click="inspectManager.moveCtrl.start()">
                        <Icons.fa.ToolboxIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.start_sell_button')"
                        @click="inspectManager.sellCtrl.start()">
                        <Icons.fa.TrashIcon width="2em" height="2em" fill="white" />
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isMoving" top="auto" left="1" right="1" bottom="1">
            <UI.Flex items="start" gap="3">
                <UI.Paragraph class="font-bold text-white">
                    Moving {{ selected.name }}
                </UI.Paragraph>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.confirm_move_button')"
                        @click="inspectManager.moveCtrl.confirm()">
                        <Icons.fa.CheckmarkIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.cancel_move_button')"
                        @click="inspectManager.moveCtrl.cancel()">
                        <Icons.fa.TimesIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.move_left_button')"
                        @click="console.log('not implemented yet')">
                        <Icons.fa.ArrowLeftIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.move_right_button')"
                        @click="console.log('not implemented yet')">
                        <Icons.fa.ArrowRightIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.move_up_button')"
                        @click="console.log('not implemented yet')">
                        <Icons.fa.ArrowUpIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.move_down_button')"
                        @click="console.log('not implemented yet')">
                        <Icons.fa.ArrowDownIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.rotate_left_button')"
                        @click="console.log('not implemented yet')">
                        <Icons.fa.RotateLeftIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.rotate_right_button')"
                        @click="console.log('not implemented yet')">
                        <Icons.fa.RotateRightIcon width="2em" height="2em" fill="white" />
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isSelling" top="auto" left="1" right="1" bottom="1">
            <UI.Flex items="start" gap="3">
                <UI.Paragraph class="font-bold text-white">
                    Are you sure you want to sell {{ selected.name }}?
                </UI.Paragraph>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.confirm_sell_button')"
                        @click="inspectManager.sellCtrl.confirm()">
                        <Icons.fa.CheckmarkIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('game.inspect_panel.cancel_sell_button')"
                        @click="inspectManager.sellCtrl.cancel()">
                        <Icons.fa.TimesIcon width="2em" height="2em" fill="white" />
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

const localizationManager = useLocalization();
const inspectManager = useInspect();
const selected = computed(() => inspectManager.selected.value);
const isMoving = computed(() => inspectManager.moveCtrl.isMoving.value);
const isSelling = computed(() => inspectManager.sellCtrl.isSelling.value);
</script>