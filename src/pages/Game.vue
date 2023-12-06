<script setup>
import * as THREE from 'three'

import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import WebGL from 'frontend-webgl';
import Locale from '../components/Locale.vue';

import { useBank } from '../composables/bank.js';
import { useObjectives } from '../composables/objectives.js';
import { useStats } from '../composables/stats.js';
import { useInspect } from '../composables/inspect.js';
import { usePanel } from '../composables/panel.js';
import { disposeMeshCache } from '../composables/meshes.js';
import Camera from '../composables/camera.js';

import { useGround } from '../composables/ground.js';
import { useGrid } from '../composables/grid.js';
import { useItems } from '../composables/items.js';
import { useNavigation } from '../composables/navigation.js';

import IntroTimeline from '../composables/timelines/intro.js';

import { TimelineFromJson } from '../composables/timeline.js';
import introTimelineJson from '../timelines/intro.json';

import Timeline1 from '../composables/timelines/timeline1.js';
import PersistentData from '../composables/persistent_data.js';

import SettingsPanel from '../components/General/SettingsPanel.vue';
import ObjectivesPanel from '../components/Game/Panels/ObjectivesPanel.vue';
import ShopPanel from '../components/Game/Panels/ShopPanel.vue';
import PausePanel from '../components/Game/Panels/PausePanel.vue';

import SubTitle from '../components/Game/SubTitle.vue';

import TopPanel from '../components/Game/TopPanel.vue';
import BottomPanel from '../components/Game/BottomPanel.vue';
import InspectPanel from '../components/Game/InspectPanel.vue';
import Audio from '../components/UI/Audio.vue';

import { setMeta } from '../composables/meta.js';
import { ref, computed, onMounted, onUnmounted } from 'vue';

// # Dummy data
const player = ref({
    name: 'Player',
    experience: 0,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
});

const panelManager = usePanel();
const objectivesManager = useObjectives(player);
const inspectManager = useInspect();
const bankManager = useBank();
const statsManager = useStats();
const groundManager = useGround();
const gridManager = useGrid();
const itemsManager = useItems();
const navigationManager = useNavigation();

const subTitleRef = ref(null);
const audioRef = ref(null);
const audioRefBgg = ref(null);
const canvasRef = ref(null);
const intro = ref(null);
const timeline1 = ref(null);
const isPlayingIntro = ref(false);
const interacted = ref(false);
const options = {
    camera: { ...Camera.options },
};

onMounted(async () => {
    setMeta("game")

    const { renderer, camera, scene, lifeCycle } = canvasRef.value.adapter;

    renderer.alpha = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    scene.background = new THREE.CubeTextureLoader()
        .setPath('textures/cubeMaps/')
        .load([
            'px.png',
            'nx.png',
            'py.png',
            'ny.png',
            'pz.png',
            'nz.png'
        ]);

    intro.value = await TimelineFromJson(
        introTimelineJson,
        camera,
        scene,
        audioRef.value,
        audioRefBgg.value,
        subTitleRef.value,
        startGame
    );
})

onUnmounted(() => {
    Camera.manager.disable();
    panelManager.clearPanel();
    disposeMeshCache();
})

const interact = async () => {
    if (interacted.value) return;
    interacted.value = true;
    isPlayingIntro.value = true;

    const introData = await PersistentData.get('intro');
    if (introData && introData.seen) startGame();
    else intro.value.play();
}

const skipIntro = () => {
    intro.value.stop();
    startGame();
}

const startGame = async () => {
    isPlayingIntro.value = false;
    PersistentData.set('intro', { seen: true });

    const { renderer, camera, scene, lifeCycle } = canvasRef.value.adapter;

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(0, 10, 0);
    scene.add(light);

    objectivesManager.init();
    bankManager.init();
    statsManager.init();
    itemsManager.init(scene);
    await groundManager.init(scene, camera, renderer.domElement, lifeCycle);

    inspectManager.enable(camera, scene, renderer);
    groundManager.enable();
    Camera.manager.enable();
    navigationManager.enable();

    lifeCycle.onAnimate.push(() => {
        Camera.manager.update();
    });

    lifeCycle.onDispose.push(() => {
    });
}
</script>

<template>
    <UI.Fixed v-if="!interacted">
        <UI.Flex>
            <UI.Button @click="interact">
                Ready
            </UI.Button>
        </UI.Flex>
    </UI.Fixed>

    <UI.Fixed v-if="isPlayingIntro" bottom="auto" right="3" left="auto" top="3">
        <UI.Button @click="skipIntro">
            <Locale id="timeline.skip" />
        </UI.Button>
    </UI.Fixed>

    <WebGL.components.Canvas3D ref="canvasRef" :options="options" class="w-full h-screen block" />

    <Audio ref="audioRef" src="/audio/music_happy_bounce.wav" :volume="0.1" :showMute="false" />
    <Audio ref="audioRefBgg" src="/audio/music_happy_bounce.wav" :volume="0.1" :showMute="false" />
    <SubTitle ref="subTitleRef" />

    <div v-if="interacted && !isPlayingIntro">

        <TopPanel />
        <BottomPanel />

        <InspectPanel />
        <SettingsPanel />
        <ShopPanel />
        <PausePanel />
        <ObjectivesPanel :objectivesManager="objectivesManager" />
    </div>
</template>
