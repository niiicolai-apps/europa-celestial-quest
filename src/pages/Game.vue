<script setup>
import * as THREE from 'three'

import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import WebGL from 'frontend-webgl';

import { useBank } from '../composables/bank.js';
import { useObjectives } from '../composables/objectives.js';
import { useStats } from '../composables/stats.js';
import { useInspect } from '../composables/inspect.js';
import { usePanel } from '../composables/panel.js';

import SettingsPanel from '../components/General/SettingsPanel.vue';
import ObjectivesPanel from '../components/Game/Panels/ObjectivesPanel.vue';
import ShopPanel from '../components/Game/Panels/ShopPanel.vue';
import PausePanel from '../components/Game/Panels/PausePanel.vue';

import TopPanel from '../components/Game/TopPanel.vue';
import BottomPanel from '../components/Game/BottomPanel.vue';
import InspectPanel from '../components/Game/InspectPanel.vue';

import { setMeta } from '../composables/meta.js';
import { ref, onMounted, onUnmounted } from 'vue';

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

const canvasRef = ref(null);
const cameraManager = WebGL.composables.useTopDownCamera({
    minZoom: 50,
    maxZoom: 220,
    currentZoom: 150,
    currentPosition: new THREE.Vector3(0, 0, 35),
});
const options = {
    camera: {
        custom: cameraManager.camera,
        rotation: { 
            x: -60 * Math.PI / 180, 
        },
    },
};

onMounted(() => {
    setMeta("game")
    objectivesManager.init();
    bankManager.init();
    statsManager.init();

    const { renderer, camera, scene, lifeCycle } = canvasRef.value.adapter;

    inspectManager.enable(camera, renderer);

    const redColor = new THREE.Color(0xff0000);
    const greenColor = new THREE.Color(0x00ff00);

    const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
    const cubeMaterial = new THREE.MeshPhysicalMaterial({ color: greenColor });
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.name = "Cube";
    cubeMesh.userData = {
        isOwned: true,
        costs: [
            { currency: "coins", amount: 100 },
            { currency: "diamonds", amount: 10 },
        ]
    };
    cubeMesh.position.set(0, 2.5, 0);
    scene.add(cubeMesh);
    inspectManager.addSelectable(cubeMesh);

    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshPhysicalMaterial({ color: redColor });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    scene.add(groundMesh);

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(0, 10, 0);
    scene.add(light);

    lifeCycle.onAnimate.push(() => {
        cameraManager.update();
    });

    lifeCycle.onDispose.push(() => {
        scene.remove(cubeMesh);
        scene.remove(groundMesh);

        groundGeometry.dispose();
        groundMaterial.dispose();
        cubeGeometry.dispose();
        cubeMaterial.dispose();
    });

    cameraManager.enable();
})
onUnmounted(() => {
    cameraManager.disable(); 
    panelManager.clearPanel();
})
</script>

<template>
    <WebGL.components.Canvas3D 
        ref="canvasRef" 
        :options="options" 
        class="w-full h-screen block" 
    />

    <TopPanel />
    <BottomPanel />

    <InspectPanel />
    <SettingsPanel />
    <ShopPanel />
    <PausePanel />
    <ObjectivesPanel 
        :objectivesManager="objectivesManager" 
    />
    
</template>
