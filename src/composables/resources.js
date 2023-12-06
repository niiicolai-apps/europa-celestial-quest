import { ref } from 'vue';
import { getMesh } from './meshes.js';
import MESHES from '../meshes/meshes.js'
import * as THREE from 'three';

const isInitialized = ref(false);
const resources = ref([]);

export const useResources = () => {
    const init = async (scene) => {
        if (isInitialized.value) return false;

        const rock = await getMesh(MESHES.rock_resource_01);
        rock.position.set(-130, 31, -95);

        const ice = await getMesh(MESHES.ice_resource_01);
        ice.position.set(-90, 31, -130);

        scene.add(rock);
        scene.add(ice);

        resources.value.push({ object3D: rock, data: { type: 'rock' } });
        resources.value.push({ object3D: ice, data: { type: 'ice' } });
    }

    const findResourcesOfType = (type) => {
        return resources.value.filter(resource => resource.data.type === type);
    }

    const findClosest = (position, type) => {
        const resourcesOfType = findResourcesOfType(type);
        console.log(resourcesOfType);
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

    return {
        init,
        findClosest,
    }
}
