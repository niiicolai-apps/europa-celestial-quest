import { expect, test } from 'vitest'
import HealthController from '../../../src/game/health/health_controller.js'
import * as THREE from 'three'

const healthBarYOffset = 0.1;
const current = 100;
const max = 100;
const team = 'player';

test('create should create a health model', () => {
    const object3D = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    const model = HealthController.create(
        object3D, team, current, max, 
        onDie, onDamage, healthBarYOffset);

    expect(model).toBeDefined();
    expect(HealthController.getByObject3D(object3D).uuid).toBe(model.uuid);    
})

test('create should throw an error if the health model already exists', () => {
    const object3D = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    HealthController.create(
        object3D, team, current, max, 
        onDie, onDamage, healthBarYOffset);

    expect(() => {
        HealthController.create(
            object3D, team, current, max, 
            onDie, onDamage, healthBarYOffset);
    }).toThrow('Health model already exists');
})

test('remove should remove the health model', () => {
    const object3D = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    HealthController.create(
        object3D, team, current, max, 
        onDie, onDamage, healthBarYOffset);

    HealthController.remove(object3D);

    expect(HealthController.getByObject3D(object3D)).toBeUndefined();
})

test('isDead should return true if the health is dead', () => {
    const object3D = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    HealthController.create(
        object3D, team, 0, max, 
        onDie, onDamage, healthBarYOffset);

    expect(HealthController.isDead(object3D)).toBe(true);
})

test('isDead should return false if the health is not dead', () => {
    const object3D = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    HealthController.create(
        object3D, team, 1, max, 
        onDie, onDamage, healthBarYOffset);

    expect(HealthController.isDead(object3D)).toBe(false);
})

test('applyDamage should apply damage to the health model', () => {
    const object3D = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    const h = HealthController.create(
        object3D, team, current, max, 
        onDie, onDamage, healthBarYOffset);

    HealthController.applyDamage(object3D, 1, {}, 'other');

    expect(h.getCurrentHealth()).toBe(99);
})

test('isHittedWithin should return true if the health is hitted within time', () => {
    const object3D = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    const h = HealthController.create(
        object3D, team, current, max, 
        onDie, onDamage, healthBarYOffset);
    HealthController.applyDamage(object3D, 1, {}, 'other');
    
    
    expect(HealthController.isHittedWithin(object3D, 1000)).toBe(true);
})

test('isHittedWithin should return false if the health is not hitted within time', () => {
    const object3D = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    const h = HealthController.create(
        object3D, team, current, max, 
        onDie, onDamage, healthBarYOffset);
    HealthController.applyDamage(object3D, 1, {}, 'other');
    
    
    expect(HealthController.isHittedWithin(object3D, -500)).toBe(false);
})

test('reset should reset the health controller', () => {
    const object3D = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    const h = HealthController.create(
        object3D, team, current, max, 
        onDie, onDamage, healthBarYOffset);

    HealthController.applyDamage(object3D, 1, {}, 'other');
    HealthController.reset(object3D);

    expect(h.getCurrentHealth()).toBe(100);
})

test('findAllByTeam should return all health models by team', () => {
    const object3D1 = new THREE.Object3D();
    const object3D2 = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    const h1 = HealthController.create(
        object3D1, 'some new team', current, max, 
        onDie, onDamage, healthBarYOffset);
    const h2 = HealthController.create(
        object3D2, 'some new team', current, max, 
        onDie, onDamage, healthBarYOffset);

    const all = HealthController.findAllByTeam('some new team');
    const foundH1 = all.find(h => h.uuid === h1.uuid);
    const foundH2 = all.find(h => h.uuid === h2.uuid);
    expect(foundH1).toBeDefined();
    expect(foundH2).toBeDefined();
    expect(all.length).toBe(2);
})

test('findAllNotOnTeam should return all health models not on team', () => {
    const object3D1 = new THREE.Object3D();
    const object3D2 = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    const h1 = HealthController.create(
        object3D1, 'some new team', current, max, 
        onDie, onDamage, healthBarYOffset);
    const h2 = HealthController.create(
        object3D2, 'some new team', current, max, 
        onDie, onDamage, healthBarYOffset);

    const all = HealthController.findAllNotOnTeam('some new team');
    const foundH1 = all.find(h => h.uuid === h1.uuid);
    const foundH2 = all.find(h => h.uuid === h2.uuid);
    expect(foundH1).toBeUndefined();
    expect(foundH2).toBeUndefined();
})

test('findClosestNotOnTeam should return the closest health model not on team', () => {
    const object3D1 = new THREE.Object3D();
    object3D1.position.set(100, 100, 100);
    const object3D2 = new THREE.Object3D();
    const onDie = () => {};
    const onDamage = () => {};
    
    const h1 = HealthController.create(
        object3D1, 'some new team 2', current, max, 
        onDie, onDamage, healthBarYOffset);
    const h2 = HealthController.create(
        object3D2, 'some new team', current, max, 
        onDie, onDamage, healthBarYOffset);

    const found = HealthController.findClosestNotOnTeam('some new team', { x: 100, y: 100, z: 100 });
    expect(found).toBeDefined();
    expect(found.closest).toBeDefined();
    expect(found.closest.uuid).toBe(h1.uuid);
})