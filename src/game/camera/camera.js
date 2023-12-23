import * as THREE from 'three'
import WebGL from 'frontend-webgl'
import { useManager } from '../managers/manager.js'
import PersistentData from '../persistent_data/persistent_data.js'

const currentZoom = 150;
const currentPosition = new THREE.Vector3(0, 0, 35);
const minZoom = 50;
const maxZoom = 620;
const zoomSpeed = 3;
const moveSpeed = 0.1;

const manager = WebGL.composables.useTopDownCamera({
    minZoom,
    maxZoom,
    currentZoom,
    currentPosition,
    zoomSpeed,
    moveSpeed,
})

const options = {
    custom: manager.camera,
    rotation: {
        x: -60 * Math.PI / 180,
    },
}

const setZoomSpeed = async (value) => {
    manager.setZoomSpeed(value);
    await PersistentData.set('camera_zoom_speed', {value});
}

const setMoveSpeed = async (value) => {
    manager.setMoveSpeed(value);
    await PersistentData.set('camera_move_speed', {value});
}

const focus = async (object) => {
    manager.focus(object);
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('camera', {
    enable: {
        priority: 1,
        callback: async () => {
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
        callback: async () => {
            manager.update();
        }
    },
    onBeforeTimeline: {
        priority: 1,
        callback: async () => {
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: async () => {
            manager.camera.rotation.x = -60 * Math.PI / 180;
            manager.camera.rotation.y = 0 * Math.PI / 180;
            manager.camera.rotation.z = 0 * Math.PI / 180;
        }
    }
})

export default {
    manager,
    options,
    setZoomSpeed,
    setMoveSpeed,
    focus,
}
