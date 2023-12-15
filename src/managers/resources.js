import { ref } from 'vue';
import { getMesh } from '../composables/meshes.js';
import { useMap } from './map.js';
import { useManager } from './manager.js';
import { useCanvas } from '../composables/canvas.js';

const resources = ref([]);
const isInitialized = ref(false);

const createResources = async (resourcesData, scene) => {
    for (const resourceData of resourcesData) {
        const resource = await getMesh(resourceData.mesh.name);
        const { position, rotation, scale } = resourceData;

        resource.position.set(position.x, position.y, position.z);
        resource.rotation.set(rotation.x, rotation.y, rotation.z);
        resource.scale.set(scale.x, scale.y, scale.z);
        scene.add(resource);

        resources.value.push({ 
            object3D: resource, 
            data: { 
                current: resourceData.max,
                type: resourceData.type,
                max: resourceData.max 
            } 
        });
    }
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('resources', {
    init: {
        priority: 2, // Must be higher than map.js
        callback: async () => {
            if (isInitialized.value) return false
            
            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            const scene = adapter.scene
            const map = useMap();
            const resourcesData = await map.resources();
            await createResources(resourcesData, scene);
            isInitialized.value = true;
        }
    }
})

export const useResources = () => {

    const findResourcesOfType = (type) => {
        return resources.value.filter(resource => resource.data.type === type);
    }

    const findClosest = (position, type) => {
        const resourcesOfType = findResourcesOfType(type);
        if (!resourcesOfType) return null;

        let closest = null;
        let closestDistance = Infinity;
        for (const resource of resourcesOfType) {
            const distance = resource.object3D.position.distanceTo(position);
            if (distance < closestDistance) {
                closest = resource.object3D;
                closestDistance = distance;
            }
        }

        return closest;
    }

    const getRandom = () => {
        const index = Math.floor(Math.random() * resources.value.length);
        return resources.value[index];
    }

    return {
        findClosest,
        getRandom,
    }
}
