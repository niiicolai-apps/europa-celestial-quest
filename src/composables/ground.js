import * as THREE from 'three'
import { ref } from 'vue';

const isInitialized = ref(false);
const onIntersect = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let camera = null;
let domElement = null;
let groundMesh = null;

export const useGround = () => {

    const init = (scene, _camera, _domElement, lifeCycle) => {
        if (isInitialized.value) return false;

        const geometry = new THREE.PlaneGeometry(100, 100);
        const material = new THREE.MeshPhysicalMaterial({ color: 0x00ff00 });
        groundMesh = new THREE.Mesh(geometry, material);
        groundMesh.rotation.x = -Math.PI / 2;

        camera = _camera;
        domElement = _domElement;
        scene.add(groundMesh);

        lifeCycle.onDispose.push(() => {
            geometry.dispose();
            material.dispose();
            scene.remove(groundMesh);
        });

        isInitialized.value = true;
        return true;
    }

    const mouseDown = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(groundMesh);
        if (intersects.length > 0) {
            const point = intersects[0].point;
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
        addOnIntersect
    }
}
