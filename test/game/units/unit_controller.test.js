import { expect, test } from 'vitest'
import UnitController from '../../../src/game/units/unit_controller.js'
import * as THREE from 'three'

const object3D = new THREE.Object3D()
const object3DOther = new THREE.Object3D()
const object3DOther2 = new THREE.Object3D()

object3D.position.set(0, 0, 0)
object3DOther.position.set(10, 0, 0)

test('create should create a new unit', () => {
    const unit = UnitController.create(object3D, { name: 'test', features: [] }, 'team-1')
    expect(unit.data.name).toBe('test')
})

test('findByObject3D should find a unit by object3D', () => {
    const unit = UnitController.findByObject3D(object3D)
    expect(unit.data.name).toBe('test')
})

test('findByName should find a unit by name', () => {
    const unit = UnitController.findByName('test')
    expect(unit.data.name).toBe('test')
})

test('findAllByTeam should find all units by team', () => {
    UnitController.create(object3DOther, { name: 'test2', features: [] }, 'team-55')
    const units = UnitController.findAllByTeam('team-55')
    expect(units.length).toBe(1)
})

test('findAllNotOnTeam should find all units not on the team', () => {
    const units = UnitController.findAllNotOnTeam('team-55')
    expect(units.length).toBe(1)
})

test('findClosest should find the closest unit', () => {
    const position = new THREE.Vector3(8, 0, 0)
    const result = UnitController.findClosest(UnitController.units.value, position)
    expect(result.closestDistance).toBe(2)
    expect(result.unit.object3D.uuid).toBe(object3DOther.uuid)
})

test('findClosestNotOnTeam should find the closest unit not on the team', () => {
    const position = new THREE.Vector3(8, 0, 0)
    const result = UnitController.findClosestNotOnTeam('team-55', position)
    expect(result.closestDistance).toBe(8)
    expect(result.unit.object3D.uuid).toBe(object3D.uuid)
})

test('countByName should count units by name', () => {
    const count = UnitController.countByName('test')
    expect(count).toBe(1)
})

test('countByTeam should count units by team', () => {
    const count = UnitController.countByTeam('team-55')
    expect(count).toBe(1)
})

test('countByNameAndTeam should count units by name and team', () => {
    UnitController.create(object3DOther2, { name: 'test2', features: [] }, 'team-55')
    const count = UnitController.countByNameAndTeam('test2', 'team-55')
    expect(count).toBe(2)
})

test('remove should remove a unit', () => {
    UnitController.remove(object3D)
    expect(UnitController.units.value.length).toBe(2)
    UnitController.remove(object3DOther)
    UnitController.remove(object3DOther2)
    expect(UnitController.units.value.length).toBe(0)
})
