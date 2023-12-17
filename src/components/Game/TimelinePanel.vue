<template>
    <UI.Fixed v-if="isPlayingTimeline" bottom="auto" right="auto" left="3" top="3">
        <UI.Button @click="skipTimeline">
            <Locale id="timeline.skip" />
        </UI.Button>
    </UI.Fixed>

    <Transition name="fade">
        <UI.Fixed class="bg-black" v-if="showFade" style="z-index: 9999;" />
    </Transition>    
</template>

<script setup>
import UI from 'frontend-ui';
import Locale from '../General/Locale.vue';
import { useTimeline } from '../../composables/timeline.js';
import { computed } from 'vue';

const timelineManager = useTimeline();
const isPlayingTimeline = computed(() => timelineManager.isPlaying());
const skipTimeline = () => timelineManager.stop();
const showFade = computed(() => timelineManager.showTransition.value);
</script>