import { ref } from "vue";
import { 
    isCollidingAt as _isCollidingAt,
    isColliding as _isColliding,
    isACollidingWithB as _isACollidingWithB,
} from "./collision_model.js";

/**
 * Objects that are in the collision system.
 * 
 * @type {Array}
 */
const objects = ref([]);

/**
 * Add an object to the collision system.
 * 
 * @param {THREE.Object3D} object
 * @returns {void}
 */
const add = (object) => {
    objects.value.push(object);
}

/**
 * Remove an object from the collision system.
 * 
 * @param {THREE.Object3D} object
 * @returns {void}
 */
const remove = (object) => {
    const index = objects.value.indexOf(object);
    if (index > -1) {
        objects.value.splice(index, 1);
    }
}

/**
 * Get the object from the collision system.
 * 
 * @param {THREE.Object3D} object3D
 * @returns {Boolean}
 */
const get = (object3D) => {
    return objects.value.find(object => object.uuid === object3D.uuid);
}

/**
 * Checks if the object collides with any of the objects in the scene.
 * 
 * @param {THREE.Object3D} object3D
 * @returns {Boolean}
 */
const isColliding = (object3D) => {
    return _isColliding(object3D, objects.value);
}

/**
 * Checks if the object collides with any of the objects in the scene at the given point.
 * 
 * @param {THREE.Object3D} object3D
 * @param {Object} point
 * @returns {Boolean}
 */
const isCollidingAt = (object3D, point) => {
    return _isCollidingAt(object3D, point, objects.value);
}

/**
 * Checks if the object collides with another object.
 * 
 * @param {THREE.Object3D} a
 * @param {THREE.Object3D} b
 * 
 * @returns {Boolean}
 */
const isACollidingWithB = (a, b) => {
    return _isACollidingWithB(a, b);
}

export default {
    objects,
    get,
    add,
    remove,    
    isColliding,
    isCollidingAt,
    isACollidingWithB,
}
