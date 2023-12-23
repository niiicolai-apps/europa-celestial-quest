import { ref } from 'vue';
import CameraModel from './camera_model.js';

const model = ref(null);

/**
 * Create the camera.
 * 
 * @returns {CameraModel}
 */
const create = (camera, domElement) => {    
    model.value = CameraModel(camera, domElement);
    return model.value;
}

/**
 * Get the camera.
 * 
 * @returns {CameraModel}
 */
const get = () => model.value;

/**
 * Remove the camera.
 * 
 * @returns {void}
 */
const remove = () => {
    if (model.value) {
        model.value.setEnable(false);
    }

    model.value = null;
}

/**
 * Set enabled.
 * 
 * @param {Boolean} value
 * @returns {void}
 */
const setEnable = (value) => {
    if (model.value) {
        model.value.setEnabled(value);
    }
}

/**
 * Update the camera.
 * 
 * @returns {void}
 */
const update = () => {
    if (model.value) {
        model.value.update();
    }
}

/**
 * Set the camera zoom speed.
 * 
 * @param {Number} value
 * @returns {<void>}
 */
const setZoomSpeed = (value) => {
    if (model.value) {
        model.value.setZoomSpeed(value);
    }
}

/**
 * Set the camera pan speed.
 * 
 * @param {Number} value
 * @returns {<void>}
 */
const setPanSpeed = (value) => {
    if (model.value) {
        model.value.setPanSpeed(value);
    }
}

/**
 * Set the camera position.
 * 
 * @param {Object} position
 * @returns {<void>}
 */
const setPosition = (position) => {
    if (model.value) {
        model.value.setPosition(position);
    }
}

export default {
    create,
    get,
    remove,
    setEnable,
    setZoomSpeed,
    setPanSpeed,
    setPosition,
    update
}
