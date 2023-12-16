import * as THREE from 'three'
import { ref } from 'vue'
import { useManager } from './manager.js';
import { useCanvas } from '../composables/canvas.js';

const mapName = ref('map1')
const isInitialized = ref(false)
const lights = ref([])

const fetchMapData = async (mapName) => {
    if (!mapName) throw new Error('mapName is required');
    const mapData = await fetch(`/maps/${mapName}.json`).then(r => r.json());
    if (!mapData) throw new Error(`Map not found: ${mapName}`);
    return mapData;
}

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

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('map', {
    init: {
        priority: 1, // Must be lower than resources.js
        callback: async () => {
            if (isInitialized.value) return false
    
            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            const scene = adapter.scene
            const mapData = await fetchMapData(mapName.value);
            createLights(mapData, scene)
            isInitialized.value = true;
        }
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => {
            for (const light of lights.value) {
                light.visible = false;
            }
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
            for (const light of lights.value) {
                light.visible = true;
            }
        }
    }
})

export const useMap = () => {

    const name = async () => {
        const mapData = await fetchMapData(mapName.value);
        return mapData.name;
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

    const players = async () => {
        const mapData = await fetchMapData(mapName.value);
        return mapData.players;
    }

    const camera = async () => {
        const mapData = await fetchMapData(mapName.value);
        return mapData.camera;
    }

    return {
        name,
        terrain,
        resources,
        objectives,
        players,
        camera
    }
}
