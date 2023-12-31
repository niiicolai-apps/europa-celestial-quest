<template>
    <div v-show="isInitialized">
        <Audio :showMute="false" />
        <Audio :showMute="false" />
        <GameEndPanel />
        <TimelinePanel />
        <SubTitle />
        <Toast />
        <Tutorial />
        <Canvas />

        <div v-if="isGameStarted && !isPlayingTimeline">
            <PausePanel :endGame="endGame" />
            <ObjectivesPanel />
            <SettingsPanel />
            <ShopPanel />

            <TopPanel />
            <InspectPanel />
            <BottomPanel />
        </div>
    </div>

    <Transition name="fade">
        <div v-if="!isInitialized">
            <Loader 
                titleLocaleId="map_loader.title"
                :descriptionLocaleId="`map_loader.tip${tip}`"
            />
        </div>
    </Transition>
</template>

<script setup>
import SettingsPanel from './General/SettingsPanel.vue';
import ObjectivesPanel from './Game/Panels/ObjectivesPanel.vue';
import ShopPanel from './Game/Panels/ShopPanel.vue';
import PausePanel from './Game/Panels/PausePanel.vue';
import TopPanel from './Game/TopPanel.vue';
import BottomPanel from './Game/BottomPanel.vue';
import InspectPanel from './Game/InspectPanel.vue';
import GameEndPanel from './Game/GameEndPanel.vue';
import TimelinePanel from '../components/Game/TimelinePanel.vue';
import Tutorial from './UI/Tutorial.vue';

import Toast from './UI/Toast.vue';
import SubTitle from './UI/SubTitle.vue';
import Audio from './UI/Audio.vue';
import Canvas from './UI/Canvas.vue';
import Loader from './UI/Loader.vue';

import { useTimeline } from '../composables/timeline.js';
import { useGameManager } from '../game/managers/game_manager.js';
import { ref, computed, onMounted, onUnmounted, defineEmits } from 'vue';

const emits = defineEmits(['endGame']);
const endGame = () => emits('endGame');

const gameManager = useGameManager();
const timelineManager = useTimeline();
const tip = Math.floor(Math.random() * 3) + 1;

const isGameStarted = computed(() => gameManager.isGameStarted());
const isPlayingTimeline = computed(() => timelineManager.isPlaying());
const isInitialized = ref(false);
const minLoadTime = 3000;

onMounted(async () => {
    await gameManager.init(endGame);
    await gameManager.resumeGame();
    setTimeout(() => isInitialized.value = true, minLoadTime);
})

onUnmounted(() => {
    isInitialized.value = false;
})
</script>