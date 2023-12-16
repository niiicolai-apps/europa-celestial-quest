import * as THREE from 'three'
import WebGL from 'frontend-webgl'
import { useManager } from '../managers/manager.js'

const currentZoom = 150;
const currentPosition = new THREE.Vector3(0, 0, 35);
const minZoom = 50;
const maxZoom = 620;

const manager = WebGL.composables.useTopDownCamera({
    minZoom,
    maxZoom,
    currentZoom,
    currentPosition,
})

const options = {
    custom: manager.camera,
    rotation: {
        x: -60 * Math.PI / 180,
    },
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('camera', {
    enable: {
        priority: 1,
        callback: async (options) => {
            manager.enable();
        }
    },
    disable: {
        priority: 1,
        callback: async () => {
            manager.disable();
        }
    },
    onAnimate: {
        priority: 1,
        callback: async (options) => {
            manager.update();
        }
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => {
            manager.disable();
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
            manager.enable();
            manager.camera.position.set(0, currentZoom, 0)
            manager.camera.rotation.set(options.rotation.x, 0, 0)
        }
    }
})

export default {
    manager,
    options,
}
