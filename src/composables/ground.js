import * as THREE from 'three'
import { ref } from 'vue';
import { getMesh } from './meshes.js';
import { useMap } from './map.js';
import { useHeightMap } from './height_map.js';

const isInitialized = ref(false);
const onIntersect = [];
const map = useMap();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let camera = null;
let domElement = null;
let groundMesh = null;

export const useGround = () => {

    const init = async (scene, _camera, _domElement, lifeCycle) => {
        if (isInitialized.value) return false;

        const terrainData = await map.terrain();
        const { mesh, position, rotation, scale } = terrainData;
        
        groundMesh = await getMesh(mesh.name);        
        groundMesh.position.set(position.x, position.y, position.z);                
        groundMesh.rotation.set(rotation.x, rotation.y, rotation.z);
        groundMesh.scale.set(scale.x, scale.y, scale.z);
        
        camera = _camera;
        domElement = _domElement;
        scene.add(groundMesh);

        lifeCycle.onDispose.push(() => {
            scene.remove(groundMesh);
        });

        isInitialized.value = true;
        await useHeightMap().init(scene);
        //useHeightMap().bake(groundMesh, scene, 10);
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
