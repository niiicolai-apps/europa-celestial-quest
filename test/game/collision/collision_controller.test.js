import CollisionController from '../../../src/game/collision/collision_controller.js'
import { expect, test } from 'vitest'
import * as THREE from 'three'

test('add should add an object to the collision system', () => {    
    const object = new THREE.Object3D();

    CollisionController.add(object);

    expect(CollisionController.get(object).uuid).toBe(object.uuid);
})

test('remove should remove an object from the collision system', () => {
    const object = new THREE.Object3D();

    CollisionController.add(object);
    CollisionController.remove(object);

    expect(CollisionController.get(object)).toBe(undefined);
})

test('isColliding should return true if the object collides with another object', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshA = new THREE.Mesh(boxGeometry);
    const meshB = new THREE.Mesh(boxGeometry);

    meshA.position.set(0, 0, 0);
    meshB.position.set(0, 0, 0);

    CollisionController.add(meshA);
    CollisionController.add(meshB);

    expect(CollisionController.isColliding(meshA)).toBe(true);
    expect(CollisionController.isColliding(meshB)).toBe(true);

    CollisionController.remove(meshA);
    CollisionController.remove(meshB);
})

test('isColliding should return false if the object does not collide with another object', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshA = new THREE.Mesh(boxGeometry);
    const meshB = new THREE.Mesh(boxGeometry);

    meshA.position.set(20, 0, 0);
    meshB.position.set(30, 0, 0);

    CollisionController.add(meshA);
    CollisionController.add(meshB);

    expect(CollisionController.isColliding(meshA)).toBe(false);
    expect(CollisionController.isColliding(meshB)).toBe(false);

    CollisionController.remove(meshA);
    CollisionController.remove(meshB);
})

test('isCollidingAt should return true if the object collides with another object at the given point', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshA = new THREE.Mesh(boxGeometry);
    const meshB = new THREE.Mesh(boxGeometry);

    meshA.position.set(0, 0, 0);
    meshB.position.set(0, 0, 0);

    CollisionController.add(meshA);
    CollisionController.add(meshB);

    expect(CollisionController.isCollidingAt(meshA, { x: 0, z: 0 })).toBe(true);
    expect(CollisionController.isCollidingAt(meshB, { x: 0, z: 0 })).toBe(true);

    CollisionController.remove(meshA);
    CollisionController.remove(meshB);
})

test('isCollidingAt should return false if the object does not collide with another object at the given point', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshA = new THREE.Mesh(boxGeometry);
    const meshB = new THREE.Mesh(boxGeometry);

    meshA.position.set(20, 0, 0);
    meshB.position.set(30, 0, 0);

    CollisionController.add(meshA);
    CollisionController.add(meshB);

    expect(CollisionController.isCollidingAt(meshA, { x: 20, z: 20 })).toBe(false);
    expect(CollisionController.isCollidingAt(meshB, { x: 20, z: 20 })).toBe(false);

    CollisionController.remove(meshA);
    CollisionController.remove(meshB);
})