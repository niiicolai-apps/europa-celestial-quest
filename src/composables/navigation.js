import { ref } from 'vue';
import * as THREE from 'three';
import { useGround } from './ground.js';

const agents = ref([]);
const ground = useGround();
const worldDown = new THREE.Vector3(0, -1, 0);

const loop = () => {
    for (const agent of agents.value) {
        const direction = new THREE.Vector3().subVectors(agent.destination, agent.object3D.position);
        const distance = direction.length();
        const velocity = direction.normalize().multiplyScalar(agent.speed);
        if (distance > 0.1) {
            const position = agent.object3D.position.clone();
            position.add(velocity);
            position.y += 1;
            const intersect = ground.getIntersectFromPosition(position, worldDown);
            if (intersect) {
                position.copy(intersect);
            }
            agent.object3D.position.copy(position);

        } else {
            agent.object3D.position.copy(agent.destination);
        }
        
        const remainingDistance = new THREE.Vector3().subVectors(agent.destination, agent.object3D.position).length();
        if (remainingDistance < 0.1) {
            agent.object3D.position.copy(agent.destination);
            agents.value = agents.value.filter(a => a !== agent);
        }
    }
}

export const useNavigation = () => {
    const addAgent = (object3D, destination, speed) => {
        agents.value.push({object3D, destination, speed});
    }

    const removeAgent = (agent) => {
        agents.value = agents.value.filter(a => a !== agent);
    }

    const enable = () => {
        setInterval(loop, 1000 / 60);
    }

    const disable = () => {
        clearInterval(loop);
    }

    return {
        agents,
        addAgent,
        removeAgent,
        enable,
        disable
    }
}
