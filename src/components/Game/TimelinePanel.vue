<template>
    <UI.Fixed v-if="isPlayingTimeline" bottom="auto" right="3" left="auto" top="3">
        <UI.Button @click="skipTimeline">
            <Locale id="timeline.skip" />
        </UI.Button>
    </UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui';
import Locale from '../Locale.vue';
import { useTimeline } from '../../composables/timeline.js';
import { computed } from 'vue';

const timelineManager = useTimeline();
const isPlayingTimeline = computed(() => timelineManager.isPlaying());
const skipTimeline = () => timelineManager.stop();
</script>