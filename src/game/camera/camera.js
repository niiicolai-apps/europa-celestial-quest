import * as THREE from 'three'
import { useManager } from '../managers/manager.js'
import PersistentData from '../persistent_data/persistent_data.js'

import { useCanvas } from '../../composables/canvas.js'
import { MapControls } from 'three/addons/controls/MapControls.js';


const minZoom = 100;
const maxZoom = 620;
const startZoom = 300;
const minPolarAngle = 10 * Math.PI / 180;
const startPolarAngle = 45 * Math.PI / 180;
const maxPolarAngle = 80 * Math.PI / 180;

let zoomSpeed = 3;
let panSpeed = 1;
let controls = null;

const setZoomSpeed = async (value) => {
    zoomSpeed = value;
    //if (controls) controls.zoomSpeed = value;
    await PersistentData.set('camera_zoom_speed', { value });
}

const setMoveSpeed = async (value) => {
    panSpeed = value;
    //if (controls) controls.panSpeed = value;
    await PersistentData.set('camera_move_speed', { value });
}

const setPosition = async (position) => {
    if (controls) {
        controls.target.x = position.x;
        controls.target.y = position.y;
        controls.target.z = position.z;
    }
    
    const camera = useCanvas().getCamera();
    camera.position.x = position.x;
    camera.position.y = position.y + 10
    camera.position.z = position.z;
}

const setRotation = async (rotation) => {
    /*const camera = useCanvas().getCamera();
    camera.rotation.x = rotation.x;
    camera.rotation.y = rotation.y;
    camera.rotation.z = rotation.z;*/
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('camera', {
    init: {
        priority: 1,
        callback: async () => {
            const camera = useCanvas().getCamera();
            const renderer = useCanvas().getRenderer();
            controls = new MapControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.minDistance = minZoom;
            controls.maxDistance = maxZoom;
            controls.zoomSpeed = zoomSpeed;
            controls.panSpeed = panSpeed;
            controls.maxPolarAngle = maxPolarAngle;
            controls.minPolarAngle = minPolarAngle;
            controls.polarAngle = startPolarAngle;
            console.log('controls', controls)
            //controls.zoom = startZoom;
        }
    },
    enable: {
        priority: 1,
        callback: async () => {
            //if (controls) controls.enabled = true;
        }
    },
    disable: {
        priority: 1,
        callback: async () => {
            //if (controls) controls.enabled = false;
        }
    },
    onAnimate: {
        priority: 1,
        callback: async () => {
            controls?.update();
        }
    },
    onBeforeTimeline: {
        priority: 1,
        callback: async () => {
            //if (controls) controls.enabled = false;
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: async () => {
            //if (controls) controls.enabled = true;
        }
    }
})

export default {
    setZoomSpeed,
    setMoveSpeed,
    setPosition,
    setRotation,
}
