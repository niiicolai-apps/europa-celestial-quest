import * as THREE from 'three'
import { ref } from 'vue';
import { getMesh } from '../../composables/meshes.js';
import { useMap } from './map.js';
import { useHeightMap } from '../navigation/height_map.js';
import { useManager } from '../managers/manager.js';
import { useCanvas } from '../../composables/canvas.js';

const isInitialized = ref(false);
const onIntersect = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let camera = null;
let domElement = null;
let groundMesh = null;

const mouseDown = (event) => {
    const point = useGround().getIntersectionFromMouse(event);
    if (point) {
        for (const callback of onIntersect) {
            callback(point);
        }
    }
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('ground', {
    init: {
        priority: 2, // Must be higher than map.js
        callback: async (options) => {
            if (isInitialized.value) return false

            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            const scene = adapter.scene
            const lifeCycle = adapter.lifeCycle;
            const renderer = adapter.renderer;

            const map = useMap();
            const terrainData = await map.terrain();
            const { mesh, position, rotation, scale } = terrainData;

            //groundMesh = await getMesh(mesh.name);
            //groundMesh.position.set(position.x, position.y, position.z);
            //groundMesh.rotation.set(rotation.x, rotation.y, rotation.z);
            //groundMesh.scale.set(scale.x, scale.y, scale.z);
            //scene.add(groundMesh);

            const planeSize = 1000;
            const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
            const planeMat = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
            groundMesh = new THREE.Mesh(planeGeo, planeMat);
            groundMesh.position.y = -1;
            groundMesh.rotation.x = Math.PI * -.5;
            scene.add(groundMesh);

            camera = adapter.camera;
            domElement = renderer.domElement;

            lifeCycle.onDispose.push(() => {
                scene.remove(groundMesh);
            });

            isInitialized.value = true;
            await useHeightMap().init(scene);
            //useHeightMap().bake(groundMesh, scene, 10);
        }
    },
    enable: {
        priority: 1,
        callback: () => {
            domElement.addEventListener('mousedown', mouseDown);
        }
    },
    disable: {
        priority: 1,
        callback: () => {
            domElement.removeEventListener('mousedown', mouseDown);
        }
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => {
            if (groundMesh) groundMesh.visible = false;
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
            if (groundMesh) groundMesh.visible = true;
        }
    }
})

export const useGround = () => {

    const getIntersectFromPosition = (position, direction) => {
        if (!isInitialized.value) return null;

        raycaster.set(position, direction);
        const intersects = raycaster.intersectObject(groundMesh);
        if (intersects.length > 0) {
            return intersects[0].point;
        }
        return null;
    }

    const getIntersectionFromMouse = (event) => {
        if (!isInitialized.value) return null;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(groundMesh);
        if (intersects.length > 0) {
            return intersects[0].point;
        }
        return null;
    }

    const addOnIntersect = (callback) => {
        onIntersect.push(callback);
    }

    return {
        addOnIntersect,
        getIntersectFromPosition,
        getIntersectionFromMouse,
    }
}
