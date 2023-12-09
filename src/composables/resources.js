import { ref } from 'vue';
import { getMesh } from './meshes.js';
import { useMap } from './map.js';

const isInitialized = ref(false);
const map = useMap();
const resources = ref([]);

export const useResources = () => {
    const init = async (scene) => {
        if (isInitialized.value) return false;

        const resourcesData = await map.resources();
        for (const resourceData of resourcesData) {
            const resource = await getMesh(resourceData.mesh.name);
            resource.position.set(resourceData.position.x, resourceData.position.y, resourceData.position.z);
            resource.rotation.set(resourceData.rotation.x, resourceData.rotation.y, resourceData.rotation.z);
            resource.scale.set(resourceData.scale.x, resourceData.scale.y, resourceData.scale.z);
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
        init,
        findClosest,
        getRandom,
    }
}
