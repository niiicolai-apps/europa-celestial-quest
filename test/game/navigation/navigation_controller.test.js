import NavigationController from '../../../src/game/navigation/navigation_controller.js'
import { expect, test } from 'vitest'
import * as THREE from 'three'

const speed = 0.1;
const acceptableDistance = 0.1;

test('create should create a navigation model', () => {
    const object3D = new THREE.Object3D();
    const model = NavigationController.create(object3D, speed, acceptableDistance);

    expect(model).toBeDefined();
    expect(NavigationController.getByObject3D(object3D).uuid).toBe(model.uuid);
})

test('create should throw an error if the navigation model already exists', () => {
    const object3D = new THREE.Object3D();
    NavigationController.create(object3D, speed, acceptableDistance);

    expect(() => {
        NavigationController.create(object3D, speed, acceptableDistance);
    }).toThrow('Navigation model already exists');
})

test('remove should remove the navigation model', () => {
    const object3D = new THREE.Object3D();
    NavigationController.create(object3D, speed, acceptableDistance);

    NavigationController.remove(object3D);

    expect(NavigationController.getByObject3D(object3D)).toBeUndefined();
})

test('setDestination should set the destination of the navigation model', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(10, 0, 0);
    NavigationController.create(object3D, speed, acceptableDistance);

    NavigationController.setDestination(object3D, destination);

    const nd = NavigationController.getByObject3D(object3D).getDestination();
    expect(nd.x).toBe(destination.x);
    expect(nd.y).toBe(destination.y);
    expect(nd.z).toBe(destination.z);
})

test('setDestination should set isMoving to true', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(10, 0, 0);
    NavigationController.create(object3D, speed, acceptableDistance);

    NavigationController.setDestination(object3D, destination);

    expect(NavigationController.isMoving(object3D)).toBe(true);
})

test('setDestination should update the lookAt of the object3D', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(10, 0, 0);
    NavigationController.create(object3D, speed, acceptableDistance);

    NavigationController.setDestination(object3D, destination);

    expect(object3D.rotation.y).toBe(Math.PI / 2);
})

test('setDestination should not update the lookAt of the object3D if the destination is the same as the position', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(0, 0, 0);
    NavigationController.create(object3D, speed, acceptableDistance);

    NavigationController.setDestination(object3D, destination);

    expect(object3D.rotation.y).toBe(0);
})

test('setDestinationToPosition should set the destination of the navigation model to the position of the object3D', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(10, 0, 0);
    NavigationController.create(object3D, speed, acceptableDistance);

    NavigationController.setDestination(object3D, destination);
    NavigationController.setDestinationToPosition(object3D);

    const nd = NavigationController.getByObject3D(object3D).getDestination();
    expect(nd.x).toBe(object3D.position.x);
    expect(nd.y).toBe(object3D.position.y);
    expect(nd.z).toBe(object3D.position.z);
})

test('getDestination should return the destination of the navigation model', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(10, 0, 0);
    NavigationController.create(object3D, speed, acceptableDistance);
    NavigationController.setDestination(object3D, destination);

    const nd = NavigationController.getDestination(object3D);

    expect(nd.x).toBe(destination.x);
    expect(nd.y).toBe(destination.y);
    expect(nd.z).toBe(destination.z);
})

test('getDestination should return undefined if the navigation model does not exist', () => {
    const object3D = new THREE.Object3D();

    const nd = NavigationController.getDestination(object3D);

    expect(nd).toBeUndefined();
})

test('setPaused should set the paused state of the navigation model', () => {    
    NavigationController.setPaused(true);

    expect(NavigationController.getPaused()).toBe(true);
})

test('setPaused should set the paused state of the navigation model', () => {    
    NavigationController.setPaused(false);

    expect(NavigationController.getPaused()).toBe(false);
})

test('reachedDestination should return true if the object3D is at the destination', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(10, 0, 0);
    NavigationController.create(object3D, speed, acceptableDistance);
    NavigationController.setDestination(object3D, destination);
    object3D.position.copy(destination);

    const reached = NavigationController.reachedDestination(object3D);

    expect(reached).toBe(true);
})

test('reachedDestination should return false if the object3D is not at the destination', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(10, 0, 0);
    NavigationController.create(object3D, speed, acceptableDistance);
    NavigationController.setDestination(object3D, destination);

    const reached = NavigationController.reachedDestination(object3D);

    expect(reached).toBe(false);
})

test('remainingDistance should return the remaining distance to the destination', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(10, 0, 0);
    NavigationController.create(object3D, speed, acceptableDistance);
    NavigationController.setDestination(object3D, destination);

    const distance = NavigationController.remainingDistance(object3D);

    expect(distance).toBe(10);
})

test('setAcceptableDistance should set the acceptable distance of the navigation model', () => {
    const object3D = new THREE.Object3D();
    const acceptableDistance = 0.5;
    NavigationController.create(object3D, speed, 0.1);

    NavigationController.setAcceptableDistance(object3D, acceptableDistance);

    expect(NavigationController.getByObject3D(object3D).getAcceptableDistance()).toBe(acceptableDistance);
})

test('setSpeed should set the speed of the navigation model', () => {
    const object3D = new THREE.Object3D();
    const speed = 0.5;
    NavigationController.create(object3D, 0.1, acceptableDistance);

    NavigationController.setSpeed(object3D, speed);

    expect(NavigationController.getByObject3D(object3D).getSpeed()).toBe(speed);
})

test('update should move the object3D towards the destination', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(1, 0, 0);
    NavigationController.create(object3D, speed, acceptableDistance);
    NavigationController.setDestination(object3D, destination);

    NavigationController.update();

    expect(object3D.position.x).toBeGreaterThan(0);
})

test('update should not move the objects if paused', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(1, 0, 0);
    NavigationController.create(object3D, speed, acceptableDistance);
    NavigationController.setDestination(object3D, destination);
    NavigationController.setPaused(true);

    NavigationController.update();

    expect(object3D.position.x).toBe(0);
    NavigationController.setPaused(false);
})