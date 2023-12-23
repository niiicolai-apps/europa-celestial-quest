import { expect, test } from 'vitest'
import {
    move,
    lookAt,
    remainingDistance,
    reachedDestination
} from '../../../src/game/navigation/navigation_model.js'
import * as THREE from 'three'

test('move should move the position towards the destination', () => {    
    const destination = new THREE.Vector3(10, 0, 0);
    const position = new THREE.Vector3(0, 0, 0);
    const speed = 0.1;

    move(destination, position, speed);

    expect(position.x).toBeGreaterThan(0);
    expect(position.y).toBe(0);
    expect(position.z).toBe(0);
})

test('lookAt should look at the destination', () => {
    const object3D = new THREE.Object3D();
    const destination = new THREE.Vector3(10, 0, 0);
    const position = new THREE.Vector3(0, 0, 0);

    lookAt(object3D, position, destination);

    expect(object3D.rotation.y).toBe(Math.PI / 2);
})

test('remainingDistance should return the distance between the destination and position', () => {
    const destination = new THREE.Vector3(10, 0, 0);
    const position = new THREE.Vector3(0, 0, 0);

    const distance = remainingDistance(destination, position);

    expect(distance).toBe(10);
})

test('reachedDestination should return true if the remaining distance is less than the acceptable distance', () => {
    const destination = new THREE.Vector3(10, 0, 0);
    const position = new THREE.Vector3(0, 0, 0);
    const acceptableDistance = 10;

    const reached = reachedDestination(destination, position, acceptableDistance);

    expect(reached).toBe(true);
})

test('reachedDestination should return false if the remaining distance is greater than the acceptable distance', () => {
    const destination = new THREE.Vector3(10, 0, 0);
    const position = new THREE.Vector3(0, 0, 0);
    const acceptableDistance = 9;

    const reached = reachedDestination(destination, position, acceptableDistance);

    expect(reached).toBe(false);
})