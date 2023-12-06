import MapJson from '../map/map1.json'
import * as THREE from 'three'
import { ref } from 'vue'

const map = ref(MapJson)
const isInitialized = ref(false)
const lights = ref([])

const createLights = (scene) => {
    for (const lightData of map.value.lights) {
        const color = new THREE.Color(
            lightData.color.r,
            lightData.color.g,
            lightData.color.b
        );

        let light = null;
        switch (lightData.type) {
            case 'ambient':
                light = new THREE.AmbientLight(color, lightData.intensity);
                break;
            case 'directional':
                light = new THREE.DirectionalLight(color, lightData.intensity);
                break;
            case 'point':
                light = new THREE.PointLight(color, lightData.intensity);
                break;
            default:
                throw new Error(`Unknown light type: ${lightData.type}`);
        }

        if (lightData.position) {
            light.position.set(
                lightData.position.x,
                lightData.position.y,
                lightData.position.z
            );
        }

        if (lightData.target) {
            light.target.position.set(
                lightData.target.x,
                lightData.target.y,
                lightData.target.z
            );
        }
        scene.add(light);
        lights.value.push(light);
    }
}

export const useMap = () => {

    const init = async (scene) => {
        if (isInitialized.value) return false
        createLights(scene)
        isInitialized.value = true;
    }

    return {
        map,
        init,
    }
}
