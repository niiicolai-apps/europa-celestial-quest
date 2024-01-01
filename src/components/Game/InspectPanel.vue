<template>
    <Transition name="slide-up">
        <UI.Fixed v-if="selected && !isMoving && !isSelling && !isUpgrading && !isBuilding" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">
                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <div class="bg-primary font-bold text-info text-xs p-1 rounded">
                        <Locale :id="`constructions.${selected.name}.title`" />
                    </div>

                    <div v-if="isUpgradeable" class="bg-primary font-bold text-info text-xs p-1 rounded">
                        <Locale id="inspect.upgrade" /> {{ selectedConstruction.upgradeIndex + 1 }}
                    </div>

                    <div v-if="!selectedIsYours" class="bg-primary font-bold text-info text-xs p-1 rounded">
                        <Locale id="inspect.other_team_construction" />
                    </div>
                </UI.Flex>
                
                <UI.Grid columns="4" justify="start" gap="1" v-if="selectedIsYours">
                    <UI.Button @click="inspectManager.moveCtrl.start()" class="h-15">
                        <Icons.fa.UpDownLeftRightIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.start_move_button" />
                        </p>
                    </UI.Button>

                    <UI.Button @click="inspectManager.sellCtrl.start()" class="h-15">
                        <Icons.fa.TrashIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.start_sell_button" />
                        </p>
                    </UI.Button>

                    <UI.Button v-if="isUpgradeable && !isMaxUpgradeReached"
                        @click="inspectManager.upgradeCtrl.start()" class="h-15">
                        <Icons.fa.CircleUpIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.start_upgrade_button" />
                        </p>
                    </UI.Button>

                    <UI.Button v-if="canBuild" @click="inspectManager.unitCtrl.start()" class="h-15">
                        <Icons.fa.UserAstronautIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.start_unit_button" />
                        </p>
                    </UI.Button>
                </UI.Grid>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isMoving" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">
                <span class="bg-primary font-bold text-info text-xs p-1 rounded">
                    <Locale id="inspect.moving_title" /> <Locale :id="`constructions.${selected.name}.title`" />
                    <span>
                        <Locale :id="`constructions.${selected.name}`" />
                    </span>
                </span>
                <UI.Flex direction="horizontal" justify="between" gap="1" class="w-full">
                    <UI.Grid gap="1">
                        <UI.Button type="success" @click="inspectManager.moveCtrl.confirm()" class="h-15">
                            <Icons.fa.CheckmarkIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                            <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                <Locale id="inspect.confirm_move_button" />
                            </p>
                        </UI.Button>

                        <UI.Button @click="inspectManager.moveCtrl.cancel()" class="h-15">
                            <Icons.fa.TimesIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                            <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                <Locale id="inspect.cancel_move_button" />
                            </p>
                        </UI.Button>
                    </UI.Grid>
                    <UI.Flex direction="horizontal" justify="between" gap="1">
                        <UI.Grid gap="1">
                            
                            <UI.Button @click="inspectManager.moveCtrl.rotateRight()" class="h-15">
                                <Icons.fa.RotateLeftIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.rotate_left_button" />
                                </p>
                            </UI.Button>
                            
                            <UI.Button @click="inspectManager.moveCtrl.moveLeft()" class="h-15">
                                <Icons.fa.ArrowLeftIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.move_left_button" />
                                </p>
                            </UI.Button>
                        </UI.Grid>
                        <UI.Grid gap="1">
                            <UI.Button @click="inspectManager.moveCtrl.moveBackward()" class="h-15">
                                <Icons.fa.ArrowUpIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.move_up_button" />
                                </p>
                            </UI.Button>

                            <UI.Button @click="inspectManager.moveCtrl.moveForward()" class="h-15">
                                <Icons.fa.ArrowDownIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.move_down_button" />
                                </p>
                            </UI.Button>
                        </UI.Grid>
                        <UI.Grid gap="1">
                            <UI.Button @click="inspectManager.moveCtrl.rotateLeft()" class="h-15">
                                <Icons.fa.RotateRightIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.rotate_right_button" />
                                </p>
                            </UI.Button>
                            <UI.Button @click="inspectManager.moveCtrl.moveRight()" class="h-15">
                                <Icons.fa.ArrowRightIcon width="1.5em" height="1.5em" fill="#3f88c5" />
                                <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                                    <Locale id="inspect.move_right_button" />
                                </p>
                            </UI.Button>
                        </UI.Grid>
                    </UI.Flex>
                </UI.Flex>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isSelling" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">
                <span class="bg-primary font-bold text-info text-xs p-1 rounded">
                    <Locale id="inspect.selling_title" /> 
                    <span>
                        <Locale :id="`constructions.${selected.name}`" /> <Locale :id="`constructions.${selected.name}.title`" />
                        <span>?</span>
                    </span>
                </span>

                <UI.Grid columns="2" gap="1">
                    <UI.Button type="danger" @click="inspectManager.sellCtrl.confirm()" class="h-15">
                        <Icons.fa.CheckmarkIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.confirm_sell_button" />
                        </p>
                    </UI.Button>

                    <UI.Button type="primary" @click="inspectManager.sellCtrl.cancel()" class="h-15">
                        <Icons.fa.TimesIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.cancel_sell_button" />
                        </p>
                    </UI.Button>
                </UI.Grid>
            </UI.Flex>
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isUpgrading" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <span class="bg-primary font-bold text-info text-xs p-1 rounded">
                        <Locale id="inspect.upgrading_title" /> 
                        <span>
                            <Locale :id="`constructions.${selected.name}`" /> <Locale :id="`constructions.${selected.name}.title`" />
                            <span>?</span>
                        </span>
                    </span>

                    <span class="bg-primary font-bold text-info text-xs p-1 rounded">
                        <span>
                            <Locale id="inspect.upgrading_cost" />:
                        </span>
                    </span>
                    <UI.Flex direction="horizontal" v-for="cost in upgradeCost" :key="cost.currency" gap="1" class="bg-primary font-bold text-info text-xs p-1 rounded">
                        <UI.Flex direction="horizontal" gap="1">
                            <p>
                                <Locale :id="`bank.${cost.currency}`" />:
                            </p>
                            <div class="text-center font-bold">
                                <p>{{ cost.amount }}</p>
                            </div>
                        </UI.Flex>
                    </UI.Flex>
                </UI.Flex>

                <UI.Grid columns="2" gap="1">
                    <UI.Button type="success" @click="inspectManager.upgradeCtrl.confirm()" class="h-15">
                        <Icons.fa.CheckmarkIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.confirm_upgrade_button" />
                        </p>
                    </UI.Button>

                    <UI.Button type="primary" @click="inspectManager.upgradeCtrl.cancel()" class="h-15">
                        <Icons.fa.TimesIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.cancel_upgrade_button" />
                        </p>
                    </UI.Button>
                </UI.Grid>
            </UI.Flex>            
        </UI.Fixed>
    </Transition>

    <Transition name="slide-up">
        <UI.Fixed v-if="selected && isBuilding" top="auto">
            <UI.Flex items="start" gap="3" class="bg-info p-3 box-shadow-lg border-t-1 border-solid border-primary">
                <span class="bg-primary font-bold text-info text-xs p-1 rounded">
                    <Locale id="inspect.unit_title" /> <Locale :id="`constructions.${selected.name}.title`" />
                </span>

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

                <UI.Flex direction="horizontal" items="auto" justify="start" gap="3" class="w-full">
                    <UI.Button @click="inspectManager.unitCtrl.cancel()" class="h-26 w-17">
                        <Icons.fa.ArrowLeftIcon :width="iconSize" :height="iconSize" :fill="iconFill" />
                        <p class="text-info uppercase font-bold" style="font-size: 0.7em;">
                            <Locale id="inspect.cancel_unit_button" />
                        </p>
                    </UI.Button>

                    <UI.Flex direction="horizontal" justify="start" items="start" gap="2" class="w-full" style="overflow-x: auto;">
                        <UI.Button 
                            v-for="unit in allowedUnits"
                            :key="unit.name"
                            type="primary"
                            @click="inspectManager.unitCtrl.queueUnit(unit.name)"
                            class="h-26"
                        >
                            <div>
                                <UI.Flex direction="horizontal" justify="between" class="w-full text-left text-info text-xs">
                                    <div class="w-full">
                                        <p class="font-bold uppercase">
                                            <Locale :id="`units.${unit.name}.title`" />
                                        </p>
                                        <p style="font-size: 0.8em;">
                                            <Locale :id="`units.${unit.name}.description`" />
                                        </p>
                                        <p style="font-size: 0.8em;">
                                            <Locale :id="`inspect.build_time`" />: {{ (parseInt(unit.complete_time)/1000) }}s
                                        </p>
                                    </div>
                                        
                                    <UI.Flex class="bg-info rounded w-15 h-10">
                                        <img :src="unit.image" :alt="unit.name" class="block w-7 mx-auto" />
                                    </UI.Flex>
                                </UI.Flex>
                                    
                                <UI.Flex direction="horizontal" class="w-full h-13 text-info">
                                    <UI.Flex v-for="cost in unit.costs" :key="cost.currency" gap="1" class="text-xs w-4">
                                        <div>
                                            <Icons.fa.RingIcon v-if="cost.currency == 'metal'" :width="unitCostIconSize" :height="unitCostIconSize"
                                                :fill="iconFill" />
                                            <Icons.fa.IciclesIcon v-if="cost.currency == 'ice'" :width="unitCostIconSize" :height="unitCostIconSize"
                                                :fill="iconFill" />
                                            <Icons.fa.AtomIcon v-if="cost.currency == 'hydrogen'" :width="unitCostIconSize" :height="unitCostIconSize"
                                                :fill="iconFill" />
                                            <Icons.fa.HillRockSlideIcon v-if="cost.currency == 'rock'" :width="unitCostIconSize" :height="unitCostIconSize"
                                                :fill="iconFill" />
                                            <Icons.fa.BoltIcon v-if="cost.currency == 'power'" :width="unitCostIconSize" :height="unitCostIconSize"
                                                :fill="iconFill" />
                                        </div>
                                        <div class="text-center font-bold mb-1" style="font-size: .7em;">
                                            <p class="mb-1">
                                                <Locale :id="`bank.${cost.currency}`" />
                                            </p>
                                            <p>{{ cost.amount }}</p>
                                        </div>
                                    </UI.Flex>
                                </UI.Flex>
                            </div>
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
import { useItems } from '../../game/constructions/constructions.js';

const iconSize = "1.5em";
const iconFill = "#3f88c5";

const unitCostIconSize = "0.5em";

const localizationManager = useLocalization();
const inspectManager = useInspect();

const selected = computed(() => inspectManager.selected.value);
const selectedIsYours = computed(() => inspectManager.selectedIsYours.value);
const selectedConstruction = computed(() => {
    return selected.value ? useItems().findByObject3D(selected.value) : null
});

const isMoving = computed(() => inspectManager.moveCtrl.isMoving.value);
const isSelling = computed(() => inspectManager.sellCtrl.isSelling.value);

const isUpgrading = computed(() => inspectManager.upgradeCtrl.isUpgrading.value);
const isUpgradeable = computed(() => inspectManager.upgradeCtrl.isUpgradeable());
const isMaxUpgradeReached = computed(() => inspectManager.upgradeCtrl.isMaxUpgradeReached());
const upgradeCost = computed(() => inspectManager.upgradeCtrl.getUpgradeCost());

const isBuilding = computed(() => inspectManager.unitCtrl.isBuilding().value);
const canBuild = computed(() => inspectManager.unitCtrl.canBuild());
const allowedUnits = computed(() => isBuilding ? inspectManager.unitCtrl.getAllowedUnits() : []);
const unitsQueue = computed(() => isBuilding ? inspectManager.unitCtrl.getQueue()?.queue || [] : []);

const getUnitProgress = (queue) => {
    const start = queue.startTime;
    const completeTime = queue.completeTime;
    const now = Date.now();
    const progress = Math.abs(completeTime - now);
    return progress > (completeTime - start) ? (completeTime - start) : progress;
}

const getUnitMaxProgress = (queue) => {
    const start = queue.startTime;
    const completeTime = queue.completeTime;
    return completeTime - start;   
}
</script>