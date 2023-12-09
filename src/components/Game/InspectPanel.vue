<template>
    <Transition name="slide-up">
        <UI.Fixed v-if="selected && !isMoving && !isSelling && !isUpgrading && !isBuilding" top="auto" left="1" right="1" bottom="1">
            <UI.Flex items="start" gap="3">
                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Paragraph class="font-bold text-white">
                        <Locale :id="`constructions.${selected.name}`" />
                    </UI.Paragraph>

                    <UI.Paragraph v-if="isUpgradeable" class="font-bold text-white">
                        (<Locale id="inspect.upgrade" /> {{ selected.userData.upgrade.index + 1 }})
                    </UI.Paragraph>
                </UI.Flex>
                
                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('inspect.start_move_button')"
                        @click="inspectManager.moveCtrl.start()">
                        <Icons.fa.ToolboxIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.start_sell_button')"
                        @click="inspectManager.sellCtrl.start()">
                        <Icons.fa.TrashIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button v-if="isUpgradeable && !isMaxUpgradeReached"
                        :title="localizationManager.getLocale('inspect.start_upgrade_button')"
                        @click="inspectManager.upgradeCtrl.start()">
                        <Icons.fa.ArrowUpIcon width="2em" height="2em" fill="white" />
                    </UI.Button>

                    <UI.Button v-if="canBuild"
                        :title="localizationManager.getLocale('inspect.start_unit_button')"
                        @click="inspectManager.unitCtrl.start()">
                        <Icons.fa.PersonIcon width="2em" height="2em" fill="white" />
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
                    <span><Locale :id="`constructions.${selected.name}`" /></span>

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
                    <span><Locale :id="`constructions.${selected.name}`" />?</span>
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
                    <span><Locale :id="`constructions.${selected.name}`" />?</span>
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

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isBuilding" top="auto" left="1" right="1" bottom="1">
            <UI.Flex items="start" gap="3">
                <UI.Flex direction="horizontal" gap="1" class="font-bold text-white">
                    <Locale id="inspect.unit_title" />
                    <span>?</span>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('inspect.cancel_unit_button')"
                        @click="inspectManager.unitCtrl.cancel()">
                        <Icons.fa.ArrowLeftIcon width="2em" height="2em" fill="white" />
                    </UI.Button>
                    
                    <UI.Button 
                        v-for="queued in unitsQueue"
                        :key="queued.unit.name"
                        :title="localizationManager.getLocale('units.' + queued.unit.name)"
                        type="dark"
                    >
                        <img :src="queued.unit.image" :alt="queued.unit.name" class="block w-15 h-8 mx-auto rounded" />
                        <UI.ProgressBar
                            :progress="getUnitProgress(queued)"
                            :maxProgress="getUnitMaxProgress(queued)"
                            class="w-15 h-1 mx-auto rounded text-sm"
                        />
                    </UI.Button>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button 
                        v-for="unit in allowedUnits"
                        :key="unit.name"
                        :title="localizationManager.getLocale('units.' + unit.name)"
                        type="dark"
                        @click="inspectManager.unitCtrl.queueUnit(unit.name)"
                    >
                        <img :src="unit.image" :alt="unit.name" class="block w-15 h-9 mx-auto rounded" />
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>            
        </UI.Fixed>
    </Transition>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../General/Locale.vue';
import { ref, computed, watch } from 'vue';
import { useInspect } from '../../composables/inspect.js';
import { useLocalization } from '../../composables/localization.js';

const localizationManager = useLocalization();
const inspectManager = useInspect();
const selected = computed(() => inspectManager.selected.value);
const isMoving = computed(() => inspectManager.moveCtrl.isMoving.value);
const isSelling = computed(() => inspectManager.sellCtrl.isSelling.value);
const isUpgrading = computed(() => inspectManager.upgradeCtrl.isUpgrading.value);
const isUpgradeable = computed(() => inspectManager.upgradeCtrl.isUpgradeable());
const isMaxUpgradeReached = computed(() => inspectManager.upgradeCtrl.isMaxUpgradeReached());
const isBuilding = computed(() => inspectManager.unitCtrl.isBuilding.value);
const allowedUnits = computed(() => isBuilding ? inspectManager.unitCtrl.getAllowedUnits() : []);
const canBuild = computed(() => inspectManager.unitCtrl.canBuild());
const unitsQueue = computed(() => isBuilding ? inspectManager.unitCtrl.getQueue() : []);

const getUnitProgress = (queue) => {
    const start = queue.startTime;
    const completeTime = queue.completeTime;
    const now = Date.now();
    const progress = (now - start) / (completeTime - start);
    return progress;    
}

const getUnitMaxProgress = (queue) => {
    const start = queue.startTime;
    const completeTime = queue.completeTime;
    const now = Date.now();
    const progress = (now - start) / (completeTime - start);
    return progress;    
}
</script>