<template>
    <Transition name="slide-up">
        <UI.Fixed v-if="selected && !isMoving && !isSelling && !isUpgrading && !isBuilding" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">
                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <div class="bg-primary font-bold text-info text-xs p-1 rounded">
                        <Locale :id="`constructions.${selected.name}.title`" />
                    </div>

                    <div v-if="isUpgradeable" class="bg-primary font-bold text-info text-xs p-1 rounded">
                        <Locale id="inspect.upgrade" /> {{ selected.userData.upgrade.index + 1 }}
                    </div>

                    <div v-if="!selectedIsYours" class="bg-primary font-bold text-info text-xs p-1 rounded">
                        <Locale id="inspect.other_team_construction" />
                    </div>
                </UI.Flex>
                
                <UI.Flex direction="horizontal" justify="start" gap="1" v-if="selectedIsYours">
                    <UI.Button @click="inspectManager.moveCtrl.start()" class="h-15 w-17">
                        <Icons.fa.UpDownLeftRightIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.start_move_button" />
                        </p>
                    </UI.Button>

                    <UI.Button @click="inspectManager.sellCtrl.start()" class="h-15 w-17">
                        <Icons.fa.TrashIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.start_sell_button" />
                        </p>
                    </UI.Button>

                    <UI.Button v-if="isUpgradeable && !isMaxUpgradeReached"
                        @click="inspectManager.upgradeCtrl.start()" class="h-15 w-17">
                        <Icons.fa.CircleUpIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.start_upgrade_button" />
                        </p>
                    </UI.Button>

                    <UI.Button v-if="canBuild" @click="inspectManager.unitCtrl.start()" class="h-15 w-17">
                        <Icons.fa.UserAstronautIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.start_unit_button" />
                        </p>
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isMoving" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">
                <UI.Flex direction="horizontal" gap="1" class="bg-primary font-bold text-info text-xs p-1 rounded">
                    <Locale id="inspect.moving_title" /> <Locale :id="`constructions.${selected.name}.title`" />
                    <span>
                        <Locale :id="`constructions.${selected.name}`" />
                    </span>
                </UI.Flex>
                <UI.Flex direction="horizontal" justify="between" gap="1" class="w-full">
                    <UI.Flex justify="start" gap="1">
                        <UI.Button type="success" @click="inspectManager.moveCtrl.confirm()" class="h-15 w-17">
                            <Icons.fa.CheckmarkIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                            <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                <Locale id="inspect.confirm_move_button" />
                            </p>
                        </UI.Button>

                        <UI.Button @click="inspectManager.moveCtrl.cancel()" class="h-15 w-17">
                            <Icons.fa.TimesIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                            <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                <Locale id="inspect.cancel_move_button" />
                            </p>
                        </UI.Button>
                    </UI.Flex>
                    <UI.Flex direction="horizontal" justify="between" gap="1">
                        <UI.Flex justify="start" gap="1">
                            
                            <UI.Button @click="inspectManager.moveCtrl.rotateRight()" class="h-15 w-17">
                                <Icons.fa.RotateLeftIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.rotate_left_button" />
                                </p>
                            </UI.Button>
                            
                            <UI.Button @click="inspectManager.moveCtrl.moveLeft()" class="h-15 w-17">
                                <Icons.fa.ArrowLeftIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.move_left_button" />
                                </p>
                            </UI.Button>
                        </UI.Flex>
                        <UI.Flex justify="start" gap="1">
                            <UI.Button @click="inspectManager.moveCtrl.moveBackward()" class="h-15 w-17">
                                <Icons.fa.ArrowUpIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.move_up_button" />
                                </p>
                            </UI.Button>

                            <UI.Button @click="inspectManager.moveCtrl.moveForward()" class="h-15 w-17">
                                <Icons.fa.ArrowDownIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.move_down_button" />
                                </p>
                            </UI.Button>
                        </UI.Flex>
                        <UI.Flex justify="start" gap="1">
                            <UI.Button @click="inspectManager.moveCtrl.rotateLeft()" class="h-15 w-17">
                                <Icons.fa.RotateRightIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.rotate_right_button" />
                                </p>
                            </UI.Button>
                            <UI.Button @click="inspectManager.moveCtrl.moveRight()" class="h-15 w-17">
                                <Icons.fa.ArrowRightIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.move_right_button" />
                                </p>
                            </UI.Button>

                            
                        </UI.Flex>
                    </UI.Flex>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isSelling" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">
                <UI.Flex direction="horizontal" gap="1" class="bg-primary font-bold text-info text-xs p-1 rounded">
                    <Locale id="inspect.selling_title" /> 
                    <span>
                        <Locale :id="`constructions.${selected.name}`" /> <Locale :id="`constructions.${selected.name}.title`" />
                        <span>?</span>
                    </span>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button type="danger" @click="inspectManager.sellCtrl.confirm()" class="h-15 w-17">
                        <Icons.fa.CheckmarkIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.confirm_sell_button" />
                        </p>
                    </UI.Button>

                    <UI.Button type="primary" @click="inspectManager.sellCtrl.cancel()" class="h-15 w-17">
                        <Icons.fa.TimesIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.cancel_sell_button" />
                        </p>
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isUpgrading" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">
                <UI.Flex direction="horizontal" gap="1" class="bg-primary font-bold text-info text-xs p-1 rounded">
                    <Locale id="inspect.upgrading_title" /> 
                    <span>
                        <Locale :id="`constructions.${selected.name}`" /> <Locale :id="`constructions.${selected.name}.title`" />
                        <span>?</span>
                    </span>
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button type="success" @click="inspectManager.upgradeCtrl.confirm()" class="h-15 w-17">
                        <Icons.fa.CheckmarkIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.confirm_upgrade_button" />
                        </p>
                    </UI.Button>

                    <UI.Button type="primary" @click="inspectManager.upgradeCtrl.cancel()" class="h-15 w-17">
                        <Icons.fa.TimesIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.cancel_upgrade_button" />
                        </p>
                    </UI.Button>
                </UI.Flex>
            </UI.Flex>            
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isBuilding" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">
                <UI.Flex direction="horizontal" gap="1" class="bg-primary font-bold text-info text-xs p-1 rounded">
                    <Locale id="inspect.unit_title" /> <Locale :id="`constructions.${selected.name}.title`" />
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button 
                        v-for="queued in unitsQueue"
                        :key="queued.unit.name"
                        :title="localizationManager.getLocale('units.' + queued.unit.name)"
                        type="primary"
                        class="w-10 h-10"
                        style="padding: 0 .3em 1em .3em;"
                    >
                            <img 
                                :src="queued.unit.image" 
                                :alt="queued.unit.name" 
                                class="block w-5 h-5 mx-auto rounded mt-1 mb-1" 
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

                <UI.Flex direction="horizontal" items="auto" justify="start" gap="3">
                    <UI.Button @click="inspectManager.unitCtrl.cancel()" class="h-15 w-17">
                        <Icons.fa.ArrowLeftIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.cancel_unit_button" />
                        </p>
                    </UI.Button>

                    <UI.Flex direction="horizontal" justify="start" gap="2">
                        <UI.Button 
                            v-for="unit in allowedUnits"
                            :key="unit.name"
                            type="primary"
                            @click="inspectManager.unitCtrl.queueUnit(unit.name)"
                            class="w-40 h-15"
                        >
                            <UI.Flex direction="horizontal" justify="between" gap="1">
                                <div class="text-left text-info">
                                    <p class="font-bold uppercase text-xs text-info mb-1">
                                        <Locale :id="`units.${unit.name}.title`" />
                                    </p>
                                    <p class="text-xs text-info" style="font-size: 0.8em;">
                                        <Locale :id="`units.${unit.name}.description`" />
                                    </p>
                                </div>
                                <div>
                                    <UI.Flex class="w-12 h-10 bg-info rounded">
                                        <img :src="unit.image" :alt="unit.name" class="block w-7 mx-auto" />
                                    </UI.Flex>
                                </div>
                            </UI.Flex>
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
import { useInspect } from '../../game/inspect/inspect.js';
import { useLocalization } from '../../composables/localization.js';

const iconSize = "1.5em";
const iconFill = "#3f88c5";

const localizationManager = useLocalization();
const inspectManager = useInspect();

const selected = computed(() => inspectManager.selected.value);
const selectedIsYours = computed(() => inspectManager.selectedIsYours.value);

const isMoving = computed(() => inspectManager.moveCtrl.isMoving.value);
const isSelling = computed(() => inspectManager.sellCtrl.isSelling.value);

const isUpgrading = computed(() => inspectManager.upgradeCtrl.isUpgrading.value);
const isUpgradeable = computed(() => inspectManager.upgradeCtrl.isUpgradeable());
const isMaxUpgradeReached = computed(() => inspectManager.upgradeCtrl.isMaxUpgradeReached());

const isBuilding = computed(() => inspectManager.unitCtrl.isBuilding().value);
const canBuild = computed(() => inspectManager.unitCtrl.canBuild());
const allowedUnits = computed(() => isBuilding ? inspectManager.unitCtrl.getAllowedUnits() : []);
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