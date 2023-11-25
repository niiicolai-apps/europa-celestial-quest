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
import Camera from '../composables/camera.js';

import { useGround } from '../composables/ground.js';
import { useGrid } from '../composables/grid.js';
import { useItems } from '../composables/items.js';

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
const groundManager = useGround();
const gridManager = useGrid();
const itemsManager = useItems();

const canvasRef = ref(null);
const options = {
    camera: { ...Camera.options },
};

onMounted(() => {
    setMeta("game")
    objectivesManager.init();
    bankManager.init();
    statsManager.init();

    const { renderer, camera, scene, lifeCycle } = canvasRef.value.adapter;

    itemsManager.init(scene);
    inspectManager.enable(camera, renderer);
    groundManager.init(scene, camera, renderer.domElement, lifeCycle);
    groundManager.enable();

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(0, 10, 0);
    scene.add(light);

    const waypoints = [
        {x: 0, y: .5, z: 0},
        {x: 0, y: .5, z: 20},
        {x: 20, y: .5, z: 20},
        {x: 20, y: .5, z: 0},
    ]

    const enemyCubeGeometry = new THREE.BoxGeometry(5, 5, 5);
    const enemyCubeMaterial = new THREE.MeshPhysicalMaterial({ color: 0x0000ff });
    const enemyCubeMesh = new THREE.Mesh(enemyCubeGeometry, enemyCubeMaterial);
    enemyCubeMesh.name = "Enemy Cube";
    enemyCubeMesh.position.set(0, 2.5, 0);
    scene.add(enemyCubeMesh);

    let waypointIndex = 0;
    const enemyDestination = new THREE.Vector3();
    const speed = 0.1;
    const stoppingDistance = 0.1;

    lifeCycle.onAnimate.push(() => {
        Camera.manager.update();
    
        const distance = enemyCubeMesh.position.distanceTo(enemyDestination);
        if (distance <= stoppingDistance) {
            waypointIndex++;
            if (waypointIndex >= waypoints.length) waypointIndex = 0;
            enemyDestination.set(waypoints[waypointIndex].x, waypoints[waypointIndex].y, waypoints[waypointIndex].z);
        }

        const direction = enemyDestination.clone().sub(enemyCubeMesh.position).normalize();
        enemyCubeMesh.position.add(direction.multiplyScalar(speed));

    });

    lifeCycle.onDispose.push(() => {
    });

    Camera.manager.enable();
})
onUnmounted(() => {
    Camera.manager.disable(); 
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
