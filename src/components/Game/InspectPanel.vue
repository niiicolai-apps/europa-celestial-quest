<template>
    <Transition name="slide-up">
        <UI.Fixed v-if="selected && !isMoving && !isSelling && !isUpgrading" top="auto" left="1" right="1" bottom="1">
            <UI.Flex items="start" gap="3">
                <UI.Paragraph class="font-bold text-white">
                    {{ selected.name }}
                </UI.Paragraph>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('inspect.start_move_button')"
                        @click="inspectManager.moveCtrl.start()">
                        <Icons.fa.ToolboxIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.start_sell_button')"
                        @click="inspectManager.sellCtrl.start()">
                        <Icons.fa.TrashIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.start_upgrade_button')"
                        @click="inspectManager.upgradeCtrl.start()">
                        <Icons.fa.ArrowUpIcon width="2em" height="2em" fill="white" />
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isMoving" top="auto" left="1" right="1" bottom="1">
            <UI.Flex items="start" gap="3">
                <UI.Flex direction="horizontal" gap="1" class="font-bold text-white">
                    <Locale id="inspect.moving_title" /> 
                    <span>{{ selected.name }}</span>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('inspect.confirm_move_button')"
                        @click="inspectManager.moveCtrl.confirm()">
                        <Icons.fa.CheckmarkIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.cancel_move_button')"
                        @click="inspectManager.moveCtrl.cancel()">
                        <Icons.fa.TimesIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.move_left_button')"
                        @click="inspectManager.moveCtrl.moveLeft()">
                        <Icons.fa.ArrowLeftIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.move_right_button')"
                        @click="inspectManager.moveCtrl.moveRight()">
                        <Icons.fa.ArrowRightIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.move_up_button')"
                        @click="inspectManager.moveCtrl.moveBackward()">
                        <Icons.fa.ArrowUpIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.move_down_button')"
                        @click="inspectManager.moveCtrl.moveForward()">
                        <Icons.fa.ArrowDownIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.rotate_left_button')"
                        @click="inspectManager.moveCtrl.rotateLeft()">
                        <Icons.fa.RotateLeftIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.rotate_right_button')"
                        @click="inspectManager.moveCtrl.rotateRight()">
                        <Icons.fa.RotateRightIcon width="2em" height="2em" fill="white" />
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isSelling" top="auto" left="1" right="1" bottom="1">
            <UI.Flex items="start" gap="3">
                <UI.Flex direction="horizontal" gap="1" class="font-bold text-white">
                    <Locale id="inspect.selling_title" /> 
                    <span>{{ selected.name }}?</span>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('inspect.confirm_sell_button')"
                        @click="inspectManager.sellCtrl.confirm()">
                        <Icons.fa.CheckmarkIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.cancel_sell_button')"
                        @click="inspectManager.sellCtrl.cancel()">
                        <Icons.fa.TimesIcon width="2em" height="2em" fill="white" />
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isUpgrading" top="auto" left="1" right="1" bottom="1">
            <UI.Flex items="start" gap="3">
                <UI.Flex direction="horizontal" gap="1" class="font-bold text-white">
                    <Locale id="inspect.upgrading_title" /> 
                    <span>{{ selected.name }}?</span>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('inspect.confirm_upgrade_button')"
                        @click="inspectManager.upgradeCtrl.confirm()">
                        <Icons.fa.CheckmarkIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.cancel_upgrade_button')"
                        @click="inspectManager.upgradeCtrl.cancel()">
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
import Locale from '../Locale.vue';
import { computed } from 'vue';
import { useInspect } from '../../composables/inspect.js';
import { useLocalization } from '../../composables/localization.js';

const localizationManager = useLocalization();
const inspectManager = useInspect();
const selected = computed(() => inspectManager.selected.value);
const isMoving = computed(() => inspectManager.moveCtrl.isMoving.value);
const isSelling = computed(() => inspectManager.sellCtrl.isSelling.value);
const isUpgrading = computed(() => inspectManager.upgradeCtrl.isUpgrading.value);
</script>