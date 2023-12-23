import * as THREE from "three";

/**
 * Used to check if the object collides with any of the objects in the scene.
 */
const boxA = new THREE.Box3();
const boxB = new THREE.Box3();

/**
 * Checks if the box3 collides with any of the objects in the scene.
 * IMPORTANT: BoxA must be set before calling this function.
 * 
 * @param {THREE.Box3} box3
 * @param {String} uuid
 * @param {Array} objects
 * @returns {Boolean}
 * @private
 */
const collideWithBox = (object3D, objects=[]) => {
    for (const otherObject3D of objects) {
        if (object3D.uuid === otherObject3D.uuid) continue;

        boxB.setFromObject(otherObject3D);

        if (boxA.intersectsBox(boxB)) {
            return true;
        }
    }

    return false;
}

/**
 * Checks if the object collides with any of the objects in the scene.
 * 
 * @param {THREE.Object3D} object3D
 * @param {Array} objects
 * @returns {Boolean}
 */
const isColliding = (object3D, objects=[]) => {
    boxA.setFromObject(object3D);
    return collideWithBox(object3D, objects);
}

/**
 * Checks if the object collides with any of the objects in the scene at the given point.
 * 
 * @param {THREE.Object3D} object3D
 * @param {Object} point
 * @param {Array} objects
 * @returns {Boolean}
 */
const isCollidingAt = (object3D, point={x: 0, z: 0}, objects=[]) => {
    boxA.setFromObject(object3D);
    
    const x = point.x - object3D.position.x;
    const z = point.z - object3D.position.z;

    boxA.min.x += x;
    boxA.min.z += z;
    boxA.max.x += x;
    boxA.max.z += z;
    
    return collideWithBox(object3D, objects);
}

/**
 * Checks if the object collides with another object.
 * 
 * @param {THREE.Object3D} a
 * @param {THREE.Object3D} b
 * @returns {Boolean}
 */
const isACollidingWithB = (a, b) => {
    boxA.setFromObject(a);
    boxB.setFromObject(b);

    return boxA.intersectsBox(boxB);
}

export {
    isColliding,
    isCollidingAt,
    isACollidingWithB,
}
