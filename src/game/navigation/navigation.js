import { ref } from 'vue';
import * as THREE from 'three';
import { useManager } from '../managers/manager.js';

const agents = ref([]);
const lookAtInstance = new THREE.Vector3();
const directionInstance = new THREE.Vector3();
const remainingDistanceInstance = new THREE.Vector3();

const paused = ref(false);

const Navigator = (object3D, destination, speed, groundOffset = 0, acceptableDistance = 1) => {
    const position = object3D.position;
    const uuid = object3D.uuid;
    let looked = false;

    /**
     * Ensure to clone to avoid messing up the reference.
     */
    if (destination instanceof THREE.Vector3)
        destination = destination.clone();

    destination.y = groundOffset;
    position.y = groundOffset;

    const move = () => {
        directionInstance
            .subVectors(destination, position)
            .normalize()
            .multiplyScalar(speed);
        object3D.position.x += directionInstance.x;
        object3D.position.z += directionInstance.z;
    }

    const lookAt = () => {
        if (looked) return;
        looked = true;
        if (reachedDestination()) return;
        lookAtInstance.x = destination.x;
        lookAtInstance.z = destination.z;
        lookAtInstance.y = position.y;
        object3D.lookAt(lookAtInstance);
    }

    const remainingDistance = () => {
        return remainingDistanceInstance
            .subVectors(destination, position)
            .length();
    }

    const reachedDestination = () => {
        return remainingDistance() < acceptableDistance;
    }

    const setSpeed = (newSpeed) => {
        speed = newSpeed;
    }

    return {
        move,
        lookAt,
        remainingDistance,
        reachedDestination,
        setSpeed,
        uuid,
    }
}

const update = () => {
    if (paused.value) return;
    for (const agent of agents.value) {
        agent.move();
        agent.lookAt();

        if (agent.reachedDestination()) {
            agents.value = agents.value.filter(a => a.uuid !== agent.uuid);
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

    const addAgent = (object3D, destination, speed, groundOffset=0, acceptableDistance = 1) => {
        if (findAgent(object3D)) return;
        
        const agent = Navigator(object3D, destination, speed, groundOffset, acceptableDistance);        
        agents.value.push(agent);
        return agent;
    }

    const removeAgent = (object3D) => {
        agents.value = agents.value.filter(a => a.uuid !== object3D.uuid);
    }

    const findAgent = (object3D) => {
        return agents.value.find(a => a.uuid === object3D.uuid);
    }

    const reachedDestination = (object3D) => {
        const agent = findAgent(object3D);
        if (!agent) return false;
        return agent.reachedDestination();
    }

    return {
        agents,
        addAgent,
        removeAgent,
        reachedDestination,
        findAgent,
    }
}
