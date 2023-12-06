import { ref } from 'vue';
import * as THREE from 'three';
import { useGround } from './ground.js';

const agents = ref([]);
const ground = useGround();
const worldDown = new THREE.Vector3(0, -1, 0);
const direction = new THREE.Vector3();
const remainingDistanceVector = new THREE.Vector3();

const loop = () => {
    for (const agent of agents.value) {
        direction.subVectors(agent.destination, agent.object3D.position)
            .normalize()
            .multiplyScalar(agent.speed);
         agent.object3D.position.add(direction);

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
        if (remainingDistance < 0.1) {
            agent.object3D.position.copy(agent.destination);
            agents.value = agents.value.filter(a => a !== agent);
        }
    }
}

export const useNavigation = () => {
    const addAgent = (object3D, destination, speed, groundOffset) => {
        const exist = agents.value.find(a => a.object3D.uuid === object3D.uuid);
        if (exist) {
            exist.destination = destination;
            exist.speed = speed;
            exist.groundOffset = groundOffset;
            return;
        }

        agents.value.push({ object3D, destination, speed, groundOffset });
    }

    const removeAgent = (agent) => {
        agents.value = agents.value.filter(a => a !== agent);
    }

    const reachedDestination = (object3D, destination, acceptableDistance=0.1) => {
        const remainingDistance = remainingDistanceVector
            .subVectors(destination, object3D.position)
            .length();
        return remainingDistance < acceptableDistance;
    }

    const enable = () => {
        setInterval(loop, 30);
    }

    const disable = () => {
        clearInterval(loop);
    }

    return {
        agents,
        addAgent,
        removeAgent,
        enable,
        disable,
        reachedDestination,
    }
}
