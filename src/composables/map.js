import * as THREE from 'three'
import { ref } from 'vue'

const mapName = ref(null)
const isInitialized = ref(false)
const lights = ref([])

const createLights = (mapData, scene) => {
    for (const lightData of mapData.lights) {
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

const fetchMapData = async (mapName) => {
    if (!mapName) throw new Error('mapName is required');
    const mapData = await fetch(`/maps/${mapName}.json`).then(r => r.json());
    if (!mapData) throw new Error(`Map not found: ${mapName}`);
    return mapData;
}

export const useMap = () => {

    const init = async (scene, _mapName='map1') => {
        if (isInitialized.value) return false
        
        mapName.value = _mapName;

        const mapData = await fetchMapData(_mapName);
        createLights(mapData, scene)
        isInitialized.value = true;
    }

    const terrain = async () => {
        const mapData = await fetchMapData(mapName.value);
        return mapData.terrain;
    }

    const resources = async () => {
        const mapData = await fetchMapData(mapName.value);
        return mapData.resources;
    }

    const objectives = async () => {
        const mapData = await fetchMapData(mapName.value);
        return mapData.objectives;
    }

    const enemy = async () => {
        const mapData = await fetchMapData(mapName.value);
        return mapData.enemy;
    }

    return {
        init,
        terrain,
        resources,
        objectives,
        enemy
    }
}
