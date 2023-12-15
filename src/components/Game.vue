<template>
    <GameEndPanel />
    <TimelinePanel />
    <SubTitle ref="subTitleRef" />
    <Toast ref="toastRef" />

    <WebGL.components.Canvas3D 
        ref="canvasRef" 
        :options="webGLOptions" 
        class="w-full h-screen block" 
    />

    <Audio 
        ref="audioRef" 
        src="/audio/music_happy_bounce.wav" 
        :volume="0.1" 
        :showMute="false" 
    />

    <Audio 
        ref="audioRefBgg" 
        src="/audio/music_happy_bounce.wav" 
        :volume="0.1" 
        :showMute="false" 
    />

    <div v-if="isGameStarted && !isPlayingTimeline">
        <SettingsPanel />
        <ShopPanel />
        <PausePanel />
        <ObjectivesPanel />

        <TopPanel />
        <InspectPanel />
        <BottomPanel />
    </div>
</template>

<script setup>
import * as THREE from 'three'
import WebGL from 'frontend-webgl';
import Camera from '../composables/camera.js';

import Toast from './Game/Toast.vue';
import SettingsPanel from './General/SettingsPanel.vue';
import ObjectivesPanel from './Game/Panels/ObjectivesPanel.vue';
import ShopPanel from './Game/Panels/ShopPanel.vue';
import PausePanel from './Game/Panels/PausePanel.vue';
import SubTitle from './Game/SubTitle.vue';
import TopPanel from './Game/TopPanel.vue';
import BottomPanel from './Game/BottomPanel.vue';
import InspectPanel from './Game/InspectPanel.vue';
import GameEndPanel from './Game/GameEndPanel.vue';
import Audio from './UI/Audio.vue';
import TimelinePanel from '../components/Game/TimelinePanel.vue';

import { useTimeline } from '../composables/timeline.js';
import { useGameManager } from '../composables/game_manager.js';
import { ref, computed, onMounted, defineEmits } from 'vue';

const emits = defineEmits(['endGame']);
const gameManager = useGameManager();
const timelineManager = useTimeline();
const endGame = () => emits('endGame');

const subTitleRef = ref(null);
const audioRef = ref(null);
const audioRefBgg = ref(null);
const toastRef = ref(null);
const canvasRef = ref(null);
const isGameStarted = computed(() => gameManager.isGameStarted());
const isPlayingTimeline = computed(() => timelineManager.isPlaying());
const webGLOptions = { camera: { ...Camera.options } };

onMounted(async () => {
    const adapter = canvasRef.value.adapter;
    const { renderer } = adapter;

    renderer.alpha = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    await gameManager.init(
        adapter,
        audioRef.value,
        audioRefBgg.value,
        subTitleRef.value,
        toastRef.value,
        endGame
    );
    await gameManager.resumeGame();
})
</script>