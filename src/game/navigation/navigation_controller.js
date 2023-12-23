import { ref } from 'vue';
import NavigationModel from './navigation_model.js';

/**
 * The game's navigation models
 */
const models = ref([]);

/**
 * A flag to pause the navigation models
 * @type {boolean}
 */
const isPaused = ref(false);

/**
 * Get the navigation model by object3D
 * 
 * @param {object} object3D
 * @returns {NavigationModel}
 */
const getByObject3D = (object3D) => {
    return models.value.find(model => model.uuid === object3D.uuid);
}

/**
 * Create a navigation model
 * 
 * @param {object} object3D
 * @param {number} speed
 * @param {number} acceptableDistance
 * @returns {NavigationModel}
 */
const create = (object3D, speed=0.1, acceptableDistance=0.1, groundYOffset=0) => {
    if (getByObject3D(object3D)) {
        throw new Error('Navigation model already exists');
    }

    const model = NavigationModel(object3D, speed, acceptableDistance, groundYOffset);

    models.value.push(model);

    return model;
}

/**
 * Remove the navigation model
 * 
 * @param {object} object3D
 */
const remove = (object3D) => {
    const index = models.value.findIndex(model => model.uuid === object3D.uuid);
    if (index !== -1) {
        models.value.splice(index, 1);
    }
}

/**
 * Update the navigation models
 * 
 * @returns {void}
 */
const update = () => {
    if (isPaused.value) return;

    models.value.forEach(model => model.update());
}

/**
 * Set paused state
 * 
 * @param {boolean} state
 */
const setPaused = (state) => {
    isPaused.value = state;
}

/**
 * Check if the navigation model is paused
 * 
 * @returns {boolean}
 */
const getPaused = () => {
    return isPaused.value;
}

/**
 * Set the destination
 * 
 * @param {object} object3D
 * @param {object} destination
 */
const setDestination = (object3D, destination) => {
    const model = getByObject3D(object3D);
    if (!model) return;

    model.setDestination(destination);
}

/**
 * Get the destination
 * 
 * @param {object} object3D
 * @returns {object}
 */
const getDestination = (object3D) => {
    const model = getByObject3D(object3D);
    if (!model) return;

    return model.getDestination();
}

/**
 * Set the destination to the current position
 * 
 * @param {object} object3D
 */
const setDestinationToPosition = (object3D) => {
    const model = getByObject3D(object3D);
    if (!model) return;

    model.setDestinationToPosition();
}

/**
 * Check if the destination is reached
 * 
 * @param {object} object3D
 * @returns {boolean}
 */
const reachedDestination = (object3D) => {
    const model = getByObject3D(object3D);
    if (!model) return false;

    return model.reachedDestination();
}

/**
 * Get the remaining distance
 * 
 * @param {object} object3D
 * @returns {number}
 */
const remainingDistance = (object3D) => {
    const model = getByObject3D(object3D);
    if (!model) return 0;

    return model.remainingDistance();
}

/**
 * Check if the navigation model is moving
 * 
 * @param {object} object3D
 * @returns {boolean}
 */
const isMoving = (object3D) => {
    const model = getByObject3D(object3D);
    if (!model) return false;

    return model.isMoving();
}

/**
 * Set the acceptable distance
 * 
 * @param {object} object3D
 * @param {number} acceptableDistance
 * @returns {void}
 */
const setAcceptableDistance = (object3D, acceptableDistance) => {
    const model = getByObject3D(object3D);
    if (!model) return;

    model.setAcceptableDistance(acceptableDistance);
}

/**
 * Set the speed
 * 
 * @param {object} object3D
 * @param {number} speed
 * @returns {void}
 */
const setSpeed = (object3D, speed) => {
    const model = getByObject3D(object3D);
    if (!model) return;

    model.setSpeed(speed);
}

export default {
    getByObject3D,
    create,
    remove,
    update,
    setPaused,
    getPaused,
    getDestination,
    setDestination,
    setDestinationToPosition,
    reachedDestination,
    remainingDistance,
    isMoving,
    setAcceptableDistance,
    setSpeed,
}
