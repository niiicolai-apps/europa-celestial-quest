import { useBillboard } from "./billboard.js";
import * as THREE from 'three';
import { ref } from 'vue';

const healthObjects = ref([]);
const healthBarGeometry = ref(null);
const healthBarBggMaterial = ref(null);
const healthBarMaterial = ref(null);
const healthBarYOffset = 0.1;
const healthBarZOffset = 0.01;

const createHealthBar = (object3D) => {
    if (!healthBarGeometry.value) {
        healthBarGeometry.value = new THREE.PlaneGeometry(5, 1);
    }

    if (!healthBarBggMaterial.value) {
        healthBarBggMaterial.value = new THREE.MeshBasicMaterial({ color: 0x000000 });
    }

    if (!healthBarMaterial.value) {
        healthBarMaterial.value = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    }

    const healthBarBggMesh = new THREE.Mesh(healthBarGeometry.value, healthBarBggMaterial.value);
    const healthBarMesh = new THREE.Mesh(healthBarGeometry.value, healthBarMaterial.value);
    object3D.add(healthBarBggMesh);
    healthBarBggMesh.add(healthBarMesh);
    
    const box3 = new THREE.Box3().setFromObject(object3D);
    const size = box3.getSize(new THREE.Vector3());
    healthBarBggMesh.position.y = size.y + healthBarYOffset;
    healthBarMesh.z = healthBarZOffset;

    const setProgress = (progress, max) => {
        healthBarMesh.scale.x = progress / max;
    }

    useBillboard().add(healthBarBggMesh);

    return { setProgress }
}

export const useHealth = () => {

    const addHealthObject = (object3D, team='player', current=100, max=100, onDie=()=>{}, onDamage=(attacker)=>{}) => {
        const exist = healthObjects.value.find(h => h.object3D.uuid === object3D.uuid);
        if (exist) {
            return;
        }

        const healthBar = createHealthBar(object3D);
        healthObjects.value.push({ object3D, healthBar, team, current, max, onDie, onDamage });
    }

    const removeHealthObject = (object3D) => {
        healthObjects.value = healthObjects.value.filter(h => h.object3D.uuid !== object3D.uuid);
    }

    const applyDamage = (object3D, damage, attacker, attackerTeam='player') => {
        const healthObject = healthObjects.value.find(h => h.object3D.uuid === object3D.uuid);
        if (!healthObject) return;

        if (healthObject.team === attackerTeam) {
            throw new Error('Cannot damage own team');
        }

        healthObject.current -= damage;
        healthObject.onDamage(attacker);

        if (healthObject.current <= 0) {
            healthObject.current = 0;
            healthObject.onDie();
        }

        healthObject.healthBar.setProgress(
            healthObject.current, 
            healthObject.max
        );
    }

    const isDead = (object3D) => {
        const healthObject = healthObjects.value.find(h => h.object3D.uuid === object3D.uuid);
        if (!healthObject) return false;

        return healthObject.current <= 0;
    }

    const revive = (object3D) => {
        const healthObject = healthObjects.value.find(h => h.object3D.uuid === object3D.uuid);
        if (!healthObject) return;

        healthObject.current = healthObject.max;
    }

    const reset = () => {
        healthObjects.value = [];
        healthBarGeometry.value?.dispose();
        healthBarMaterial.value?.dispose();
        healthBarGeometry.value = null;
        healthBarMaterial.value = null;
    }

    const findAllByTeam = (team, isDead=false) => {
        return healthObjects.value.filter(h => h.team === team && (isDead ? h.current <= 0 : h.current > 0))
    }

    const findAllNotOnTeam = (team, isDead=false) => {
        return healthObjects.value.filter(h => h.team !== team && (isDead ? h.current <= 0 : h.current > 0))
    }

    return {
        addHealthObject,
        removeHealthObject,
        applyDamage,
        isDead,
        revive,
        reset,
        findAllByTeam,
        findAllNotOnTeam
    }
}
