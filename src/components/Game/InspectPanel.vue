<template>
    <Transition name="slide-up">
        <UI.Fixed v-if="selected && !isMoving && !isSelling && !isUpgrading && !isBuilding" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3">
                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <div class="bg-primary font-bold text-info text-xs p-1 rounded">
                        <Locale :id="`constructions.${selected.name}`" />
                    </div>

                    <div v-if="isUpgradeable" class="bg-primary font-bold text-info text-xs p-1 rounded">
                        <Locale id="inspect.upgrade" /> {{ selected.userData.upgrade.index + 1 }}
                    </div>
                </UI.Flex>
                
                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('inspect.start_move_button')"
                        @click="inspectManager.moveCtrl.start()">
                        <Icons.fa.ToolboxIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.start_sell_button')"
                        @click="inspectManager.sellCtrl.start()">
                        <Icons.fa.TrashIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                    </UI.Button>

                    <UI.Button v-if="isUpgradeable && !isMaxUpgradeReached"
                        :title="localizationManager.getLocale('inspect.start_upgrade_button')"
                        @click="inspectManager.upgradeCtrl.start()">
                        <Icons.fa.ArrowUpIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                    </UI.Button>

                    <UI.Button v-if="canBuild"
                        :title="localizationManager.getLocale('inspect.start_unit_button')"
                        @click="inspectManager.unitCtrl.start()">
                        <Icons.fa.PersonIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isMoving" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3">
                <UI.Flex direction="horizontal" gap="1" class="bg-primary font-bold text-info text-xs p-1 rounded">
                    <Locale id="inspect.moving_title" /> 
                    <span>
                        <Locale :id="`constructions.${selected.name}`" />
                    </span>
                </UI.Flex>
                <UI.Flex direction="horizontal" justify="between" gap="1" class="w-full">
                    <UI.Flex justify="start" gap="1">
                        <UI.Button :title="localizationManager.getLocale('inspect.confirm_move_button')" type="success"
                            @click="inspectManager.moveCtrl.confirm()">
                            <Icons.fa.CheckmarkIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        </UI.Button>

                        <UI.Button :title="localizationManager.getLocale('inspect.cancel_move_button')"
                            @click="inspectManager.moveCtrl.cancel()">
                            <Icons.fa.TimesIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        </UI.Button>
                    </UI.Flex>
                    <UI.Flex direction="horizontal" justify="between" gap="1">
                        <UI.Flex justify="start" gap="1">
                            
                            <UI.Button :title="localizationManager.getLocale('inspect.rotate_left_button')"
                                @click="inspectManager.moveCtrl.rotateRight()">
                                <Icons.fa.RotateLeftIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                            </UI.Button>
                            
                            <UI.Button :title="localizationManager.getLocale('inspect.move_left_button')"
                                @click="inspectManager.moveCtrl.moveLeft()">
                                <Icons.fa.ArrowLeftIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                            </UI.Button>
                        </UI.Flex>
                        <UI.Flex justify="start" gap="1">
                            <UI.Button :title="localizationManager.getLocale('inspect.move_up_button')"
                                @click="inspectManager.moveCtrl.moveBackward()">
                                <Icons.fa.ArrowUpIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                            </UI.Button>

                            <UI.Button :title="localizationManager.getLocale('inspect.move_down_button')"
                                @click="inspectManager.moveCtrl.moveForward()">
                                <Icons.fa.ArrowDownIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                            </UI.Button>
                        </UI.Flex>
                        <UI.Flex justify="start" gap="1">
                            <UI.Button :title="localizationManager.getLocale('inspect.rotate_right_button')"
                                @click="inspectManager.moveCtrl.rotateLeft()">
                                <Icons.fa.RotateRightIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                            </UI.Button>
                            <UI.Button :title="localizationManager.getLocale('inspect.move_right_button')"
                                @click="inspectManager.moveCtrl.moveRight()">
                                <Icons.fa.ArrowRightIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                            </UI.Button>

                            
                        </UI.Flex>
                    </UI.Flex>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isSelling" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3">
                <UI.Flex direction="horizontal" gap="1" class="bg-primary font-bold text-info text-xs p-1 rounded">
                    <Locale id="inspect.selling_title" /> 
                    <span>
                        <Locale :id="`constructions.${selected.name}`" />
                        <span>?</span>
                    </span>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('inspect.confirm_sell_button')" type="danger"
                        @click="inspectManager.sellCtrl.confirm()">
                        <Icons.fa.CheckmarkIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.cancel_sell_button')" type="primary"
                        @click="inspectManager.sellCtrl.cancel()">
                        <Icons.fa.TimesIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isUpgrading" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3">
                <UI.Flex direction="horizontal" gap="1" class="bg-primary font-bold text-info text-xs p-1 rounded">
                    <Locale id="inspect.upgrading_title" /> 
                    <span>
                        <Locale :id="`constructions.${selected.name}`" />
                        <span>?</span>
                    </span>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button :title="localizationManager.getLocale('inspect.confirm_upgrade_button')" type="success"
                        @click="inspectManager.upgradeCtrl.confirm()">
                        <Icons.fa.CheckmarkIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                    </UI.Button>

                    <UI.Button :title="localizationManager.getLocale('inspect.cancel_upgrade_button')" type="primary"
                        @click="inspectManager.upgradeCtrl.cancel()">
                        <Icons.fa.TimesIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>            
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isBuilding" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3">
                <UI.Flex direction="horizontal" gap="1" class="bg-primary font-bold text-info text-xs p-1 rounded">
                    <Locale id="inspect.unit_title" />
                    <span>?</span>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button 
                        v-for="queued in unitsQueue"
                        :key="queued.unit.name"
                        :title="localizationManager.getLocale('units.' + queued.unit.name)"
                        type="primary"
                        class="h-10"
                        style="padding: 0 .3em 1em .3em;"
                    >
                        <img 
                            :src="queued.unit.image" 
                            :alt="queued.unit.name" 
                            class="block h-6 mx-auto rounded mt-1 mb-1" 
                        />
                        <UI.ProgressBar
                            :progress="getUnitProgress(queued)"
                            :maxProgress="getUnitMaxProgress(queued)"
                            class="w-full mx-auto rounded text-sm"
                            style="height: .3em;"
                            :showPercent="false"
                            bg_color="bg-dark"
                            bar_color="bg-warning"
                        />
                    </UI.Button>
                    <UI.Flex class="h-10 bg-primary text-info font-bold rounded text-xs px-2" v-if="unitsQueue.length == 0">
                        <Locale id="inspect.empty_queue" />
                    </UI.Flex>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="3">
                    <UI.Button :title="localizationManager.getLocale('inspect.cancel_unit_button')"
                        @click="inspectManager.unitCtrl.cancel()">
                        <Icons.fa.ArrowLeftIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                    </UI.Button>

                    <UI.Flex direction="horizontal" justify="start" gap="1">
                        <UI.Button 
                            v-for="unit in allowedUnits"
                            :key="unit.name"
                            :title="localizationManager.getLocale('units.' + unit.name)"
                            type="primary"
                            @click="inspectManager.unitCtrl.queueUnit(unit.name)"
                        >
                            <img :src="unit.image" :alt="unit.name" class="block h-6 mx-auto rounded" />
                        </UI.Button>
                    </UI.Flex>
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
import { useInspect } from '../../managers/inspect.js';
import { useLocalization } from '../../composables/localization.js';

const iconSize = "1.5em";
const iconFill = "#3f88c5";

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
    const progress = completeTime - (now - start);
    return progress;    
}

const getUnitMaxProgress = (queue) => {
    return queue.completeTime;    
}
</script>