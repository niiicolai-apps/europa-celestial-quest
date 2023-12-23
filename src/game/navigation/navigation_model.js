import * as THREE from 'three';
import { ref } from 'vue';

/**
 * remaining distance instance used to calculate the remaining distance
 * @type {THREE.Vector3}
 */
const remainingDistanceInstance = new THREE.Vector3();

/**
 * look at instance used to calculate the look at position
 * @type {THREE.Vector3}
 */
const lookAtInstance = new THREE.Vector3();

/**
 * move instance used to calculate the move position
 * @type {THREE.Vector3}
 */
const directionInstance = new THREE.Vector3();

/**
 * Move the object towards the destination
 *  
 * @param {object} destination
 * @param {object} position
 * @param {number} speed
 * @returns {void}
 */
const move = (destination, position, speed) => {
    directionInstance
        .subVectors(destination, position)
        .normalize()
        .multiplyScalar(speed);

    position.add(directionInstance);
}

/**
 * Look at the destination
 * 
 * @param {object} object3D
 * @param {object} position
 * @param {object} destination
 * @returns {void}
 */
const lookAt = (object3D, position, destination) => {
    lookAtInstance.x = destination.x;
    lookAtInstance.z = destination.z;
    lookAtInstance.y = position.y;
    object3D.lookAt(lookAtInstance);
}

/**
 * remaining distance between the destination and position
 * 
 * @param {object} destination
 * @param {object} position
 * @returns {number}
 */
const remainingDistance = (destination, position) => {
    return remainingDistanceInstance
        .subVectors(destination, position)
        .length();
}

/**
 * check if the destination is reached
 * 
 * @param {object} destination
 * @param {object} position
 * @param {number} acceptableDistance
 * @returns {boolean}
 */
const reachedDestination = (destination, position, acceptableDistance) => {
    return remainingDistance(destination, position) <= acceptableDistance;
}

export {
    move,
    lookAt,
    remainingDistance,
    reachedDestination
}

/**
 * The navigation model
 */
export default (object3D, _speed=0.1, _acceptableDistance=0.1, groundYOffset=0) => {
    const destination = new THREE.Vector3();
    const position = object3D.position;
    const uuid = object3D.uuid;
    const acceptableDistance = ref(_acceptableDistance);
    const speed = ref(_speed);
    const isMoving = ref(false);

    position.y = groundYOffset;

    /**
     * Update the navigation model
     * 
     * @returns {void}
     */
    const update = () => {
        if (!isMoving.value) return;
        if (reachedDestination(destination, position, acceptableDistance.value)) {
            isMoving.value = false;
            return;
        }

        move(destination, position, speed.value);
    }

    /**
     * Set the destination
     * 
     * @param {object} newDestination
     * @returns {void}
     */
    const setDestination = (newDestination) => {
        if (newDestination.x === destination.x
         && newDestination.y === destination.y
         && newDestination.z === destination.z) return;
            
        destination.copy(newDestination);
        destination.y = position.y;        
        isMoving.value = true;
        
        lookAt(object3D, position, destination);
    }

    /**
     * Set the destination to the current position
     * 
     * @returns {void}
     */
    const setDestinationToPosition = () => {
        if (!isMoving.value) return;
        isMoving.value = false;
        destination.copy(position);
    }

    /**
     * Set the speed
     * 
     * @param {number} newSpeed
     * @returns {void}
     */
    const setSpeed = (newSpeed) => {
        speed.value = newSpeed;
    }

    /**
     * Set the acceptable distance
     * 
     * @param {number} newAcceptableDistance
     * @returns {void}
     */
    const setAcceptableDistance = (newAcceptableDistance) => {
        acceptableDistance.value = newAcceptableDistance;
    }

    return {
        isMoving: () => isMoving.value,
        remainingDistance: () => remainingDistance(destination, position),
        reachedDestination: () => {
            if (!isMoving.value) return true;
            return reachedDestination(destination, position, acceptableDistance.value);
        },
        getDestination: () => destination,
        getAcceptableDistance: () => acceptableDistance.value,
        getSpeed: () => speed.value,
        setAcceptableDistance,        
        setDestination,
        setDestinationToPosition,
        setSpeed,
        update,
        uuid,
        
    }
}
