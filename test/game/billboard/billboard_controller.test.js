import { expect, test } from 'vitest'
import * as THREE from 'three'
import BillboardController from '../../../src/game/billboard/billboard_controller.js'

test('create should create a billboard for a given object3D and camera', () => {
    const object3D = new THREE.Object3D();
    const camera = new THREE.PerspectiveCamera();
    const billboard = BillboardController.create(object3D, camera);

    expect(billboard).toBeDefined();
    expect(billboard.uuid).toBe(object3D.uuid);
})

test('create should throw an error if object3D is not an instance of THREE.Object3D', () => {
    const camera = new THREE.PerspectiveCamera();
    expect(() => BillboardController.create({}, camera)).toThrow();
})

test('create should throw an error if camera is not an instance of THREE.PerspectiveCamera', () => {
    const object3D = new THREE.Object3D();
    expect(() => BillboardController.create(object3D, {})).toThrow();
})

test('create should throw an error if object3D already has a billboard', () => {
    const object3D = new THREE.Object3D();
    const camera = new THREE.PerspectiveCamera();
    BillboardController.create(object3D, camera);

    expect(() => BillboardController.create(object3D, camera)).toThrow();
})

test('find should find the billboard by object3D', () => {
    const object3D = new THREE.Object3D();
    const camera = new THREE.PerspectiveCamera();
    const billboard = BillboardController.create(object3D, camera);

    expect(BillboardController.find(object3D).uuid).toBe(billboard.uuid);
})

test('remove should remove the billboard from the list', () => {
    const object3D = new THREE.Object3D();
    const camera = new THREE.PerspectiveCamera();

    BillboardController.create(object3D, camera);
    BillboardController.remove(object3D);

    expect(BillboardController.find(object3D)).toBeUndefined();
})

test('update should update the billboard', () => {
    const object3D = new THREE.Object3D();
    const camera = new THREE.PerspectiveCamera();
    const billboard = BillboardController.create(object3D, camera);

    camera.position.set(10, 10, 10);
    BillboardController.update();

    expect(object3D.quaternion.x).not.toBe(0);
    expect(object3D.quaternion.y).not.toBe(0);
    expect(object3D.quaternion.z).not.toBe(0);
})

test('update should not update the billboard if the camera has not moved', () => {
    const object3D = new THREE.Object3D();
    const camera = new THREE.PerspectiveCamera();
    camera.position.set(10, 10, 10);

    const billboard = BillboardController.create(object3D, camera);
    billboard.lastCameraPosition.x = 10;
    billboard.lastCameraPosition.y = 10;
    billboard.lastCameraPosition.z = 10;


    BillboardController.update();

    expect(object3D.quaternion.x).toBe(0);
    expect(object3D.quaternion.y).toBe(0);
    expect(object3D.quaternion.z).toBe(0);
})

test('update should not update the billboard if the billboard is paused', () => {
    const object3D = new THREE.Object3D();
    const camera = new THREE.PerspectiveCamera();
    camera.position.set(10, 10, 10);

    BillboardController.create(object3D, camera);
    BillboardController.setPaused(true);
    BillboardController.update();

    expect(object3D.quaternion.x).toBe(0);
    expect(object3D.quaternion.y).toBe(0);
    expect(object3D.quaternion.z).toBe(0);
})

test('setPaused should set the paused state', () => {
    const object3D = new THREE.Object3D();
    const camera = new THREE.PerspectiveCamera();
    camera.position.set(10, 10, 10);

    BillboardController.create(object3D, camera);
    BillboardController.setPaused(true);

    expect(BillboardController.isPaused.value).toBe(true);
})

