import * as THREE from 'three';

/**
 * Updates the object to always face the camera.
 * 
 * @param {PerspectiveCamera} camera The camera to face.
 * @param {Object3D} object3D The object to rotate.
 * @param {number} lastX The last x position of the camera.
 * @param {number} lastY The last y position of the camera.
 * @param {number} lastZ The last z position of the camera.
 * @returns {void}
 */
const update = (camera, object3D, lastX=null, lastY=null, lastZ=null) => {
    if (lastX === camera.position.x &&
        lastY === camera.position.y &&
        lastZ === camera.position.z) {
        return false;
    }
    
    object3D.lookAt(camera.position);
}

export {
    update
}

/**
 * Creates a billboard model.
 * 
 * @param {Object3D} object3D The object to rotate.
 * @param {PerspectiveCamera} camera The camera to face.
 * @returns {BillboardModel}
 */
export default (object3D, camera) => {
    if (!(object3D instanceof THREE.Object3D))
        throw new Error('object3D must be an instance of THREE.Object3D');

    if (!(camera instanceof THREE.PerspectiveCamera))
        throw new Error('camera must be an instance of THREE.PerspectiveCamera');
    
    const lastCameraPosition = {
        x: null,
        y: null,
        z: null
    }

    return {
        update: () => {
            update(camera, object3D, lastCameraPosition.x, lastCameraPosition.y, lastCameraPosition.z);
            lastCameraPosition.x = camera.position.x;
            lastCameraPosition.y = camera.position.y;
            lastCameraPosition.z = camera.position.z;
        },
        lastCameraPosition,
        uuid: object3D.uuid,
    }
}
