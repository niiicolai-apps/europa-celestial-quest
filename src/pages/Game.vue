<script setup>
import * as THREE from 'three'

import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import WebGL from 'frontend-webgl';

import { setMeta } from '../composables/meta.js';
import { useBank } from '../composables/bank.js';
import { useObjectives } from '../composables/objectives.js';
import { useStats } from '../composables/stats.js';
import { useInspect } from '../composables/inspect.js';
import { usePanel } from '../composables/panel.js';
import { disposeMeshCache } from '../composables/meshes.js';
import { useGround } from '../composables/ground.js';
import { useItems } from '../composables/items.js';
import { useNavigation } from '../composables/navigation.js';
import { useUnits } from '../composables/units.js';
import { useResources } from '../composables/resources.js';
import { useMap } from '../composables/map.js';
import { useEnemy } from '../composables/enemy.js';
import { TimelineFromJson } from '../composables/timeline.js';

import introTimelineJson from '../timelines/intro.json';
import PersistentData from '../composables/persistent_data.js';
import Camera from '../composables/camera.js';

import SettingsPanel from '../components/General/SettingsPanel.vue';
import ObjectivesPanel from '../components/Game/Panels/ObjectivesPanel.vue';
import ShopPanel from '../components/Game/Panels/ShopPanel.vue';
import PausePanel from '../components/Game/Panels/PausePanel.vue';
import SubTitle from '../components/Game/SubTitle.vue';
import TopPanel from '../components/Game/TopPanel.vue';
import BottomPanel from '../components/Game/BottomPanel.vue';
import InspectPanel from '../components/Game/InspectPanel.vue';
import Locale from '../components/Locale.vue';
import Audio from '../components/UI/Audio.vue';

import { ref, onMounted, onUnmounted } from 'vue';


const panelManager = usePanel();
const objectivesManager = useObjectives({});
const inspectManager = useInspect();
const bankManager = useBank();
const statsManager = useStats();
const groundManager = useGround();
const itemsManager = useItems();
const unitsManager = useUnits();
const resourcesManager = useResources();
const navigationManager = useNavigation();
const mapManager = useMap();
const enemyManager = useEnemy();

const subTitleRef = ref(null);
const audioRef = ref(null);
const audioRefBgg = ref(null);
const canvasRef = ref(null);
const intro = ref(null);
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

    Camera.manager.enable();
    inspectManager.enable(camera, scene, renderer);
    navigationManager.enable();

    await mapManager.init(scene);
    await objectivesManager.init();
    await bankManager.init();
    await statsManager.init();
    await itemsManager.init(scene);
    await unitsManager.init(scene, renderer.domElement);
    await resourcesManager.init(scene);
    await enemyManager.init(scene);
    await groundManager.init(scene, camera, renderer.domElement, lifeCycle);
    
    groundManager.enable();
    unitsManager.enable();
    enemyManager.enable();

    lifeCycle.onAnimate.push(() => {
        Camera.manager.update();
    });

    lifeCycle.onDispose.push(() => {
        Camera.manager.disable();
        inspectManager.disable();
        navigationManager.disable();
        groundManager.disable();
        unitsManager.disable();
    });

    console.log(renderer.info)
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
