import { isCollidingAt, isColliding, isACollidingWithB } from '../../../src/game/collision/collision_model.js'
import { expect, test } from 'vitest'
import * as THREE from 'three'

test('isColliding should return true if the object collides with another object', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshA = new THREE.Mesh(boxGeometry);
    const meshB = new THREE.Mesh(boxGeometry);

    meshA.position.set(0, 0, 0);
    meshB.position.set(0, 0, 0);

    expect(isColliding(meshA, [meshB])).toBe(true);
    expect(isColliding(meshB, [meshA])).toBe(true);
})

test('isColliding should return false if the object does not collide with another object', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshA = new THREE.Mesh(boxGeometry);
    const meshB = new THREE.Mesh(boxGeometry);

    meshA.position.set(0, 0, 0);
    meshB.position.set(2, 0, 0);

    expect(isColliding(meshA, [meshB])).toBe(false);
    expect(isColliding(meshB, [meshA])).toBe(false);
})

test('isCollidingAt should return true if the object collides with another object at the given point', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshA = new THREE.Mesh(boxGeometry);
    const meshB = new THREE.Mesh(boxGeometry);

    meshA.position.set(0, 0, 0);
    meshB.position.set(0, 0, 0);

    expect(isCollidingAt(meshA, { x: 0, z: 0 }, [meshB])).toBe(true);
    expect(isCollidingAt(meshB, { x: 0, z: 0 }, [meshA])).toBe(true);
})

test('isCollidingAt should return false if the object does not collide with another object at the given point', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshA = new THREE.Mesh(boxGeometry);
    const meshB = new THREE.Mesh(boxGeometry);

    meshA.position.set(0, 0, 0);
    meshB.position.set(2, 0, 0);

    expect(isCollidingAt(meshA, { x: 20, z: 20 }, [meshB])).toBe(false);
    expect(isCollidingAt(meshB, { x: 20, z: 20 }, [meshA])).toBe(false);
})

test('isACollidingWithB should return true if the object collides with another object', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshA = new THREE.Mesh(boxGeometry);
    const meshB = new THREE.Mesh(boxGeometry);

    meshA.position.set(0, 0, 0);
    meshB.position.set(0, 0, 0);

    expect(isACollidingWithB(meshA, meshB)).toBe(true);
    expect(isACollidingWithB(meshB, meshA)).toBe(true);
})

test('isACollidingWithB should return false if the object does not collide with another object', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshA = new THREE.Mesh(boxGeometry);
    const meshB = new THREE.Mesh(boxGeometry);

    meshA.position.set(0, 0, 0);
    meshB.position.set(2, 0, 0);

    expect(isACollidingWithB(meshA, meshB)).toBe(false);
    expect(isACollidingWithB(meshB, meshA)).toBe(false);
})
