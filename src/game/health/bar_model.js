import * as THREE from 'three';

/**
 * The health bar default y offset
 */
const defaultBggYOffset = 0.1;

/**
 * The health bar z offset
 */
const defaultBarZOffset = 0.05;

/**
 * The health bar geometry
 * @type {THREE.PlaneGeometry}
 */
const geometry = new THREE.PlaneGeometry(5, 1);

/**
 * The health bar background material
 * @type {THREE.MeshBasicMaterial}
 */
const bggMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

/**
 * The health bar material
 * @type {THREE.MeshBasicMaterial}
 */
const barMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

/**
 * box3 and size used for calculating health bar position
 * 
 * @type {THREE.Box3}
 * @type {THREE.Vector3}
 */
const box3 = new THREE.Box3();
const size = new THREE.Vector3();

/**
 * Set the health bar progress
 * 
 * @param {THREE.Mesh} barMesh
 * @param {number} progress
 * @param {number} max
 */
const setProgress = (barMesh, progress, max) => {
    if (progress < 0) progress = 0;
    if (progress > max) progress = max;

    barMesh.scale.x = progress / max;
    barMesh.position.x = (1 - barMesh.scale.x) * -2.5;
}


export default (object3D, healthBarYOffset=0) => {
    const bggMesh = new THREE.Mesh(geometry, bggMaterial);
    const barMesh = new THREE.Mesh(geometry, barMaterial);

    bggMesh.name = 'healthBar';

    object3D.add(bggMesh);
    bggMesh.add(barMesh);
    
    box3.setFromObject(object3D);
    box3.getSize(size);

    bggMesh.position.y = size.y + healthBarYOffset + defaultBggYOffset;
    barMesh.position.z = defaultBarZOffset;

    return {
        bggMesh,
        barMesh,
        setProgress: (progress, max) => {
            setProgress(barMesh, progress, max);
        }
    }
}
