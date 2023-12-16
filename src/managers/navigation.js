import { ref } from 'vue';
import * as THREE from 'three';
import { useHeightMap } from '../composables/height_map.js';
import { useManager } from './manager.js';

const agents = ref([]);
const lookAt = new THREE.Vector3();
const direction = new THREE.Vector3();
const remainingDistanceVector = new THREE.Vector3();
const heightMap = useHeightMap();
const paused = ref(false);

const update = () => {
    if (paused.value) return;
    for (const agent of agents.value) {
        direction.subVectors(agent.destination, agent.object3D.position)
            .normalize()
            .multiplyScalar(agent.speed);
        agent.object3D.position.add(direction);

        /*
        const y = heightMap.getY(agent.object3D.position.x, agent.object3D.position.z);
        if (y !== null) {
            agent.object3D.position.y = y + agent.groundOffset;
        }*/

        lookAt.x = agent.destination.x;
        lookAt.z = agent.destination.z;
        lookAt.y = agent.object3D.position.y;
        agent.object3D.lookAt(lookAt);
        /*
         direction.add(agent.object3D.position)
         direction.y += 1;
         const intersect = ground.getIntersectFromPosition(direction, worldDown);
         if (intersect) {
             direction.copy(intersect);
         }
         agent.object3D.position.copy(direction);*/

        const remainingDistance = remainingDistanceVector
            .subVectors(agent.destination, agent.object3D.position)
            .length();
            //console.log(remainingDistance, agent.acceptableDistance);   
        if (remainingDistance < agent.acceptableDistance) {
            agents.value = agents.value.filter(a => a !== agent);
        }
    }
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('navigation', {
    update: {
        priority: 1,
        callback: () => update()
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => {
            paused.value = true;
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
            paused.value = false;
        }
    }
})

export const useNavigation = () => {
    const addAgent = (object3D, destination, speed, groundOffset, acceptableDistance=1) => {
        const exist = agents.value.find(a => a.object3D.uuid === object3D.uuid);
        if (exist) {
            exist.destination = destination;
            exist.speed = speed;
            exist.groundOffset = groundOffset;
            exist.acceptableDistance = acceptableDistance;
            return;
        }

        agents.value.push({ object3D, destination, speed, groundOffset, acceptableDistance });
    }

    const removeAgent = (agent) => {
        agents.value = agents.value.filter(a => a !== agent);
    }

    const reachedDestination = (object3D, destination, acceptableDistance = 0.1) => {
        const remainingDistance = remainingDistanceVector
            .subVectors(destination, object3D.position)
            .length();
        return remainingDistance < acceptableDistance;
    }

    return {
        agents,
        addAgent,
        removeAgent,
        reachedDestination,
    }
}
