<script setup>
import WebGL from 'frontend-webgl';
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from './General/Locale.vue';
import SettingsPanel from './General/SettingsPanel.vue';
import PrivacyPanel from './General/PrivacyPanel.vue';
import ReleaseNotesPanel from './General/ReleaseNotesPanel.vue';
import GameLoader from './General/GameLoader.vue';
import Audio from './UI/Audio.vue';
import { usePanel } from '../composables/panel.js';
import { useAudio } from '../composables/audio.js';
import { getMesh, removeMesh } from '../game/models/meshes.js';
import { getTexturePack, removeTexturePack } from '../game/models/textures.js';
import { ref, defineEmits, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const isWeb = true;
const emits = defineEmits(['startGame']);
const panelManager = usePanel();
const audio = useAudio();
const startGame = () => emits('startGame');

const isInitialized = ref(false);
const blinkInterval = ref(null);
const canvasRef = ref(null);
const options = {
    camera: {
        far: 2000,
    }
}

onMounted(async () => {
    const audioCtrl = audio.get(0);
    audioCtrl.setSrc('audio/sacred-garden-10377.mp3');
    audioCtrl.setVolume(0.3);

    const adapter = canvasRef.value.adapter;
    const scene = adapter.scene;
    const camera = adapter.camera;
    const lifeCycle = adapter.lifeCycle;

    scene.fog = new THREE.FogExp2(0x000000, 0.005);
    scene.background = new THREE.CubeTextureLoader()
        .setPath("textures/cubeMaps/")
        .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

    const geometry = new THREE.SphereGeometry(5, 32, 16);
    const jupiter = new THREE.Mesh(geometry);
    const jupiterMaterial = await getTexturePack('jupiter', jupiter.uuid);
    jupiter.material = jupiterMaterial;
    jupiter.position.set(0, 0, -30);
    jupiter.scale.set(1, 1, 1);
    scene.add(jupiter);

    const europa = new THREE.Mesh(geometry);
    const europaMaterial = await getTexturePack('europa');
    europa.material = europaMaterial;
    europa.rotation.y = 35 * Math.PI / 180;
    europa.rotation.z = 65 * Math.PI / 180;
    europa.scale.set(.1, .1, .1);
    scene.add(europa);

    const ehdx1Light = new THREE.PointLight(0xff0000, 35, .4);
    const ehdx1 = await getMesh('europa_horizon_drifter_x1_no_parachute');
    ehdx1.position.set(0, 0,- 3);
    ehdx1.rotation.y = 15 * Math.PI / 180;
    ehdx1.scale.set(.02, .02, .02);
    scene.add(ehdx1);
    ehdx1.add(ehdx1Light);
    ehdx1Light.position.set(0, 0, 5)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 1);
    directionalLight.target = jupiter;
    scene.add(directionalLight);

    camera.position.set(-1, -1, 0);

    let moveUp = false;
    const moveSpeed = 0.0005;
    const moveCamera = () => {
        if (camera.position.y > 0.2) {
            moveUp = false;
        } else if (camera.position.y < -0.2) {
            moveUp = true;
        }

        if (moveUp) {
            camera.position.y += moveSpeed;
        } else {
            camera.position.y -= moveSpeed;
        }
    }

    const orbitRotation = 0.001;
    const orbitSpeed = 0.0002;
    const orbitRadius = 8;

    const ehdx1Radius = 1.3;
    const ehdx1Speed = 0.0005;

    const orbit = () => {
        jupiter.rotation.y -= orbitRotation;

        europa.position.x = jupiter.position.x + Math.cos(Date.now() * orbitSpeed) * orbitRadius;
        europa.position.z = jupiter.position.z + Math.sin(Date.now() * orbitSpeed) * orbitRadius;

        ehdx1.position.x = europa.position.x + Math.cos(Date.now() * ehdx1Speed) * ehdx1Radius;
        ehdx1.position.z = europa.position.z + Math.sin(Date.now() * ehdx1Speed) * ehdx1Radius;
    }

    lifeCycle.onAnimate.push(() => {
        moveCamera();
        orbit();
    })

    lifeCycle.onDispose.push(async () => {
        ehdx1.scale.set(1, 1, 1);
        await removeMesh(ehdx1);
        removeTexturePack('jupiter');
        removeTexturePack('europa');

        geometry.dispose();
    })

    const blinkRate = 1000;
    blinkInterval.value = setInterval(() => {
        ehdx1Light.intensity = ehdx1Light.intensity === 0 ? 5 : 0;
    }, blinkRate);

    isInitialized.value = true;
})

onUnmounted(async () => {
    if (blinkInterval.value) {
        clearInterval(blinkInterval.value);
    }

    isInitialized.value = false;
})
</script>

<template>
    <div v-show="isInitialized">
        <WebGL.components.Canvas3D ref="canvasRef" :options="options" class="w-full h-screen block" />

        <SettingsPanel />
        <PrivacyPanel />
        <ReleaseNotesPanel />

        <UI.Fixed>
            <UI.Fixed top="auto" bottom="3">
                <div class="w-50 mx-auto">
                    <UI.SubTitle class="uppercase text-center text-warning mb-3">
                        <Locale id="game_details.title" />
                    </UI.SubTitle>

                    <UI.Paragraph class="uppercase text-center text-secondary font-bold mb-5">
                        <Locale id="main_menu.subtitle" />
                    </UI.Paragraph>

                    <UI.Flex direction="vertical" gap="1" class="mb-5">
                        <UI.Button type="primary" @click="startGame" class="w-full py-3 font-bold uppercase">
                            <UI.Flex direction="horizontal" items="center" justify="between">
                                <Locale id="main_menu.play_button" />
                                <Icons.fa.PlayIcon width="1em" height="1em" fill="white" />
                            </UI.Flex>
                        </UI.Button>

                        <UI.Button type="primary" @click="panelManager.setPanel('settings')"
                            class="w-full py-3 font-bold uppercase">
                            <UI.Flex direction="horizontal" items="center" justify="between">
                                <Locale id="main_menu.settings_button" />
                                <Icons.fa.GearIcon width="1em" height="1em" fill="white" />
                            </UI.Flex>
                        </UI.Button>

                        <UI.Button type="primary" @click="panelManager.setPanel('privacy')"
                            class="w-full py-3 font-bold uppercase">
                            <UI.Flex direction="horizontal" items="center" justify="between">
                                <Locale id="main_menu.privacy_button" />
                                <Icons.fa.ShieldIcon width="1em" height="1em" fill="white" />
                            </UI.Flex>
                        </UI.Button>

                        <UI.Button type="primary" @click="panelManager.setPanel('release_notes')"
                            class="w-full py-3 font-bold uppercase">
                            <UI.Flex direction="horizontal" items="center" justify="between">
                                <Locale id="main_menu.release_notes_button" />
                                <Icons.fa.NewsIcon width="1em" height="1em" fill="white" />
                            </UI.Flex>
                        </UI.Button>

                        <UI.Button type="primary" class="w-full py-3 font-bold uppercase" v-if="!isWeb">
                            <UI.Flex direction="horizontal" items="center" justify="between">
                                <Locale id="main_menu.quit_button" />
                                <Icons.fa.StopIcon width="1em" height="1em" fill="white" />
                            </UI.Flex>
                        </UI.Button>
                    </UI.Flex>

                    <UI.Flex direction="horizontal" items="center" justify="center" gap="3"
                        class="uppercase font-bold text-center text-xs text-white">
                        <span>
                            <Locale id="game_details.version" />
                        </span>
                        <span class="text-danger">
                            <Locale id="game_details.subtitle" />
                        </span>
                    </UI.Flex>

                </div>
            </UI.Fixed>

            <UI.Fixed bottom="auto" right="auto" top="1" left="2">
                <Audio showMute />
            </UI.Fixed>
        </UI.Fixed>
    </div>

    <TransitionGroup name="fade">
        <div v-if="!isInitialized">
            <GameLoader />
        </div>
    </TransitionGroup>
</template>
