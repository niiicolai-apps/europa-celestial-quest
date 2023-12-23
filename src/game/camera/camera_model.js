import { ref } from 'vue';
import { MapControls } from 'three/addons/controls/MapControls.js';

/**
 * The start y position of the camera when setting the position.
 */
const startYPosition = 10;

/**
 * The damping factor of the camera.
 */
const dampingFactor = 0.05;

/**
 * The minimum and maximum polar angle of the camera.
 */
const minPolarAngle   = 10 * Math.PI / 180;
const maxPolarAngle   = 80 * Math.PI / 180;

/**
 * The minimum and maximum zoom of the camera.
 */
const minZoom = 100;
const maxZoom = 620;

/**
 * The zoom and pan speed of the camera.
 */
const zoomSpeed = ref(1);
const panSpeed = ref(1);

/**
 * Set the camera position.
 * 
 * @param {Object} position
 * @param {THREE.Camera} camera
 * @param {MapControls} controls
 * @returns {<void>}
 */
const setPosition = (position, camera, controls=null) => {
    if (controls) {
        controls.target.x = position.x;
        controls.target.y = position.y;
        controls.target.z = position.z;
    }

    camera.position.x = position.x;
    camera.position.y = position.y + startYPosition;
    camera.position.z = position.z;
}

/**
 * Set the camera zoom speed.
 * 
 * @param {Number} value 
 * @returns {<void>}
 */
const setZoomSpeed = (value, controls=null) => {    
    if (controls) 
        controls.zoomSpeed = value;

    zoomSpeed.value = value;
}

/**
 * Set the camera move speed.
 * 
 * @param {Number} value
 * @returns {<void>}
 */
const setPanSpeed = (value) => {    
    if (controls) 
        controls.panSpeed = value;

    panSpeed.value = value;
}

/**
 * get the camera position.
 *
 * @returns {Object}
 */
const getPosition = (camera) => {
    return {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
    }
}

/**
 * get the zoom speed.
 * 
 * @returns {Number}
 */
const getZoomSpeed = () => zoomSpeed.value;

/**
 * get the pan speed.
 * 
 * @returns {Number}
 */
const getPanSpeed = () => panSpeed.value;

/**
 * The camera model.
 * 
 * @param {THREE.Camera} camera
 * @param {HTMLElement} domElement
 * @returns {Object}
 */
export default (camera, domElement) => {    
    const controls = new MapControls(camera, domElement);
    
    controls.enableDamping = true;
    controls.dampingFactor = dampingFactor;
    controls.screenSpacePanning = false;
    controls.minDistance = minZoom;
    controls.maxDistance = maxZoom;
    controls.zoomSpeed = zoomSpeed.value;
    controls.panSpeed = panSpeed.value;
    controls.maxPolarAngle = maxPolarAngle;
    controls.minPolarAngle = minPolarAngle;

    return {
        controls,
        update: () => controls.update(),
        setEnabled: (value) => controls.enabled = value,
        setZoomSpeed: (value) => setZoomSpeed(value, controls),
        setPanSpeed: (value) => setPanSpeed(value, controls),
        setPosition: (position) => setPosition(position, camera, controls),
        getPosition: () => getPosition(camera),
        getZoomSpeed,
        getPanSpeed,        
    }
}
