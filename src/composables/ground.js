import * as THREE from 'three'
import { ref } from 'vue';
import { getMesh } from './meshes.js';

const isInitialized = ref(false);
const onIntersect = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let camera = null;
let domElement = null;
let groundMesh = null;

export const useGround = () => {

    const init = async (scene, _camera, _domElement, lifeCycle) => {
        if (isInitialized.value) return false;

        groundMesh = await getMesh({
            type: 'GLTF',
            url: 'meshes/utils/terrain.glb',
            subMeshes: [{
                name: 'map',
                texturePack: 'terrain',
            }],
        });
        groundMesh.position.set(0, 0, 0);
        groundMesh.scale.set(1, 1, 1);
        groundMesh.rotation.set(0, 0, 0);
        
        camera = _camera;
        domElement = _domElement;
        scene.add(groundMesh);

        lifeCycle.onDispose.push(() => {
            scene.remove(groundMesh);
        });

        isInitialized.value = true;
        return true;
    }

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

    const mouseDown = (event) => {
        const point = getIntersectionFromMouse(event);
        if (point) {
            for (const callback of onIntersect) {
                callback(point);
            }
        }
    }

    const enable = () => {
        domElement.addEventListener('mousedown', mouseDown);
    }

    const disable = () => {
        domElement.removeEventListener('mousedown', mouseDown);
    }

    const addOnIntersect = (callback) => {
        onIntersect.push(callback);
    }

    return {
        init,
        enable,
        disable,
        addOnIntersect,
        getIntersectFromPosition,
        getIntersectionFromMouse,
    }
}
