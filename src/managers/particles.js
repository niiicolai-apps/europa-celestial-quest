import { ref } from 'vue';
import { useCanvas } from '../composables/canvas.js';
import { useManager } from './manager.js';
import * as THREE from 'three';
const { System, SpriteRenderer } = window.Nebula;

const particles = ref([]);
const activeParticles = ref([]);
const waitingParticles = ref([]);
const scene = ref(null);
const timeBetweenFrames = 50;
const nextUpdate = ref(0);

const setupParticle = (activeParticle) => {
    const { particle, position, direction, parent, target, force } = activeParticle;
    let nextPosition = null;
    if (direction) activeParticle.position.add(direction);
    if (parent) nextPosition = parent.position.clone();
    if (position) nextPosition = nextPosition ? nextPosition.add(position) : position;
    if (nextPosition) {
        for (const emitter of particle.nebula.emitters) {
            emitter.setPosition(nextPosition);
        }
    }

    if (target) {
        for (const emitter of particle.nebula.emitters) {
            const behaviors = emitter.behaviours;
            const forceBehavior = behaviors.find(b => b.type === 'Force');
            const dir = target.position.clone().sub(emitter.position).normalize();
            forceBehavior.force.z = dir.z * force.z;
            forceBehavior.force.y = dir.y * force.y;
            forceBehavior.force.x = dir.x * force.z;
            emitter.updateEmitterBehaviours();
        }
    }

    particle.nebula.update();
}

const update = () => {
    if (Date.now() < nextUpdate.value) return;
    nextUpdate.value = Date.now() + timeBetweenFrames;

    for (const activeParticle of activeParticles.value) {
        setupParticle(activeParticle);
    }
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('particles', {
    init: {
        priority: 1,
        callback: async () => {
            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            scene.value = adapter.scene

            //await useParticles().load('test', 'machine_gun_muzzle');
            //await useParticles().play('test', new THREE.Vector3(-103, 40, -103));
        }
    },
    update: {
        priority: 1,
        callback: () => update()
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => {
            waitingParticles.value = [...activeParticles.value];
            activeParticles.value = [];
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
            activeParticles.value = [...waitingParticles.value];
            waitingParticles.value = [];
        }
    },
    disable: {
        priority: 1,
        callback: () => {
            activeParticles.value = [];
        }
    }
})

export const useParticles = () => {

    const load = async (id, type) => {
        if (particles.value.find(p => p.id === id)) {
            throw new Error(`Particle already loaded: ${id}`);
        }

        if (!type) {
            throw new Error(`Particle type not specified: ${type}`);
        }

        const response = await fetch(`particles/${type}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load particle: ${type}`);
        }
        const json = await response.json();
        const nebulaSystem = await System.fromJSONAsync(json, THREE);
        const nebulaRenderer = new SpriteRenderer(scene.value, THREE);
        const nebula = nebulaSystem.addRenderer(nebulaRenderer);

        particles.value.push({
            id,
            type,
            nebula
        });
    }

    const unload = (id) => {
        if (!id) {
            throw new Error(`Particle id not specified`);
        }

        const index = particles.value.findIndex(p => p.id === id);
        if (index !== -1) {
            particles.value.splice(index, 1);
        }
    }

    const play = (id, position = null, direction = null, parent = null, target=null, force={x:0, y:0, z: 0}) => {
        if (!id) {
            throw new Error(`Particle id not specified`);
        }

        if (activeParticles.value.find(p => p.particle.id === id)) {
            return;
        }

        const particle = particles.value.find(p => p.id === id);
        if (particle === undefined)
            throw new Error(`Unknown particle id: ${id}`);

        activeParticles.value.push({
            particle,
            position,
            direction,
            parent,
            target,
            force
        });
    }

    const setPosition = (id, position) => {
        if (!id) {
            throw new Error(`Particle id not specified`);
        }

        if (!position) {
            throw new Error(`Particle position not specified`);
        }

        const particle = particles.value.find(p => p.id === id);
        if (particle === undefined)
            throw new Error(`Unknown particle id: ${id}`);

        for (const emitter of particle.nebula.emitters) {
            emitter.setPosition(position);
        }
    }

    const stop = (id) => {
        if (!id) {
            throw new Error(`Particle id not specified`);
        }

        const index = activeParticles.value.findIndex(p => p.particle.id === id);
        if (index !== -1) {
            activeParticles.value.splice(index, 1);
        }
    }

    return {
        load,
        unload,
        play,
        setPosition,
        stop
    }
}
