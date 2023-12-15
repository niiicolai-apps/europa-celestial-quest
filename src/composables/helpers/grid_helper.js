import * as THREE from 'three';

const gridSize = 3;

export const getPosition = (point) => {
    const x = Math.round(point.x / gridSize) * gridSize;
    const z = Math.round(point.z / gridSize) * gridSize;
    return new THREE.Vector3(x, point.y, z);
}
