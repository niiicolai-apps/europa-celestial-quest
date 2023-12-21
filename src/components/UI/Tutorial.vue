<template>
    <Transition name="fade">
        <UI.Fixed v-if="isPlaying" style="background: #00000063; z-index: 20001;">

            <Transition name="fade">
                <div v-if="tutorial" :style="`position: fixed; z-index: 20002; top:${tutorial.top}; bottom:${tutorial.bottom}; left:${tutorial.left}; right:${tutorial.right}; width:15em;`">
                    <div class="p-3 rounded box-shadow-lg mr-2" :class="bg[tutorial.type]" style="box-shadow: 0px 0px 3px 3px var(--info);">
                        <p class="text-white text-xs w-full mb-3">
                            <Locale :id="tutorial.textLocaleId" />
                        </p>

                        <p class="text-white text-xs w-full">
                            <Locale id="tutorials.steps" /> {{ currentStep }} / {{ totalSteps }}
                        </p>

                        <UI.Flex direction="horizontal">
                            <UI.Flex direction="horizontal" gap="1" class="w-full">
                                <UI.Button v-if="currentStep > 1" :type="btn[tutorial.type]" @click="previous" class="w-full mt-3">
                                    <Locale id="tutorials.button_previous" />
                                </UI.Button>

                                <UI.Button :type="btn[tutorial.type]" @click="next" class="w-full mt-3">
                                    <Locale id="tutorials.button_next" />
                                </UI.Button>
                            </UI.Flex>

                            <UI.Button :type="btn[tutorial.type]" @click="skip" class="w-20 mt-3">
                                <Locale id="tutorials.button_skip" />
                            </UI.Button>
                        </UI.Flex>
                    </div>
                    
                    <div v-if="tutorial.icon === 'arrow-up'" class="absolute mx-auto w-10 move-up-down" :style="`left: ${tutorial.arrow_left}; right: ${tutorial.arrow_right}; top: ${tutorial.arrow_top}; bottom: ${tutorial.arrow_bottom};`">
                        <Icons.fa.ArrowUpIcon 
                            :width="iconSize" 
                            :height="iconSize" 
                            :fill="iconFill" 
                        />
                    </div>

                    <div v-if="tutorial.icon === 'arrow-down'" class="absolute mx-auto w-10 move-up-down" :style="`left: ${tutorial.arrow_left}; right: ${tutorial.arrow_right}; top: ${tutorial.arrow_top}; bottom: ${tutorial.arrow_bottom};`">
                        <Icons.fa.ArrowDownIcon 
                            :width="iconSize" 
                            :height="iconSize" 
                            :fill="iconFill" 
                        />
                    </div>

                    <div v-if="tutorial.icon === 'arrow-left'" class="absolute my-auto h-8 move-left-right" :style="`left: ${tutorial.arrow_left}; right: ${tutorial.arrow_right}; top: ${tutorial.arrow_top}; bottom: ${tutorial.arrow_bottom};`">
                        <Icons.fa.ArrowLeftIcon 
                            :width="iconSize" 
                            :height="iconSize" 
                            :fill="iconFill" 
                        />
                    </div>

                    <div v-if="tutorial.icon === 'arrow-right'" class="absolute my-auto h-8 move-left-right" :style="`left: ${tutorial.arrow_left}; right: ${tutorial.arrow_right}; top: ${tutorial.arrow_top}; bottom: ${tutorial.arrow_bottom};`">
                        <Icons.fa.ArrowRightIcon 
                            :width="iconSize" 
                            :height="iconSize" 
                            :fill="iconFill"
                        />
                    </div>
                </div>
            </Transition>

        </UI.Fixed>
    </Transition>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import { computed, onUnmounted } from 'vue';
import Locale from '../General/Locale.vue';
import { useTutorial } from '../../composables/tutorial.js';

const tutorialManager = useTutorial();
const tutorial = computed(() => tutorialManager.tutorial.value);
const isPlaying = computed(() => tutorialManager.isPlaying());
const stepsLeft = computed(() => tutorialManager.stepsLeft());
const totalSteps = computed(() => tutorialManager.totalSteps());
const currentStep = computed(() => totalSteps.value - stepsLeft.value);

const iconSize = '2em';
const iconFill = '#3f88c5';

const next = () => tutorialManager.clear();
const previous = () => tutorialManager.delayPrevious();
const skip = () => tutorialManager.clearAll();

const bg = {
    primary: 'bg-primary',
    success: 'bg-success',
    info: 'bg-info',
    warning: 'bg-warning',
    danger: 'bg-danger',
};

const btn = {
    primary: 'info',
    success: 'dark',
    info: 'primary',
    warning: 'dark',
    danger: 'dark',
};

onUnmounted(() => {
    tutorialManager.clearAll();
});

</script>

<style scoped>
.move-left-right {
    animation: move-left-right 1s infinite;
}

.move-up-down {
    animation: move-up-down 1s infinite;
}

@keyframes move-left-right {
    0% {
        transform: translateX(0);
    }
    50% {
        transform: translateX(-10px);
    }
    100% {
        transform: translateX(0);
    }
}


@keyframes move-up-down {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0);
    }
}
</style>