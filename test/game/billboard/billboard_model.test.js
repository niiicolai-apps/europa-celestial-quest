import { expect, test } from 'vitest'
import * as THREE from 'three'
import BillboardModel, { update } from '../../../src/game/billboard/billboard_model.js'

test('update should rotate the billboard to face the camera', () => {
    const object3D = new THREE.Object3D();
    object3D.position.set(0, 0, 0);
    object3D.quaternion.set(0, 0, 0);

    const camera = new THREE.PerspectiveCamera();
    camera.position.set(10, 10, 10);

    update(camera, object3D);

    expect(object3D.quaternion.x).not.toBe(0);
    expect(object3D.quaternion.y).not.toBe(0);
    expect(object3D.quaternion.z).not.toBe(0);
})

test('update should not rotate the billboard if the camera has not moved', () => {
    const object3D = new THREE.Object3D();
    object3D.position.set(0, 0, 0);
    object3D.quaternion.set(0, 0, 0);

    const camera = new THREE.PerspectiveCamera();
    camera.position.set(10, 10, 10);

    update(camera, object3D, 10, 10, 10);

    expect(object3D.quaternion.x).toBe(0);
    expect(object3D.quaternion.y).toBe(0);
    expect(object3D.quaternion.z).toBe(0);
})

test('updating the billboard model should update lastCameraPosition', () => {
    const object3D = new THREE.Object3D();
    object3D.position.set(0, 0, 0);
    object3D.quaternion.set(0, 0, 0);

    const camera = new THREE.PerspectiveCamera();
    camera.position.set(10, 10, 10);

    const billboard = BillboardModel(object3D, camera);
    billboard.update();

    expect(billboard.lastCameraPosition.x).toBe(10);
    expect(billboard.lastCameraPosition.y).toBe(10);
    expect(billboard.lastCameraPosition.z).toBe(10);
})

test('creating a billboard model should throw an error if object3D is not an instance of THREE.Object3D', () => {
    expect(() => BillboardModel({}, new THREE.PerspectiveCamera())).toThrow();
})

test('creating a billboard model should throw an error if camera is not an instance of THREE.PerspectiveCamera', () => {
    expect(() => BillboardModel(new THREE.Object3D(), {})).toThrow();
})

test('creating a billboard model should return a billboard model', () => {
    const object3D = new THREE.Object3D();
    const camera = new THREE.PerspectiveCamera();
    const billboard = BillboardModel(object3D, camera);

    expect(billboard).toBeDefined();
    expect(billboard.update).toBeDefined();
    expect(billboard.lastCameraPosition).toBeDefined();
})

test('creating a billboard model should set lastCameraPosition to null', () => {
    const object3D = new THREE.Object3D();
    const camera = new THREE.PerspectiveCamera();
    const billboard = BillboardModel(object3D, camera);

    expect(billboard.lastCameraPosition.x).toBeNull();
    expect(billboard.lastCameraPosition.y).toBeNull();
    expect(billboard.lastCameraPosition.z).toBeNull();
})

test('creating a billboard model should set the uuid', () => {
    const object3D = new THREE.Object3D();
    const camera = new THREE.PerspectiveCamera();
    const billboard = BillboardModel(object3D, camera);

    expect(billboard.uuid).toBe(object3D.uuid);
})
