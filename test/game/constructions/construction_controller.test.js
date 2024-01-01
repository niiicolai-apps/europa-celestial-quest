import { expect, test } from 'vitest'
import ConstructionController from '../../../src/game/constructions/construction_controller.js'
import ConstructionDefinitions from '../../../src/game/definitions/constructions.js'
import * as THREE from 'three'

const name = 'Europa Horizon Drifter X1'
const team = 'team-1'
const team2 = 'team-2'
const isOwned = true
const upgradeIndex = 0
const object3D = new THREE.Object3D()
const object3DOther = new THREE.Object3D()
const object3DOther2 = new THREE.Object3D()

object3D.position.set(0, 0, 0)
object3DOther.position.set(10, 0, 0)
object3DOther2.position.set(20, 0, 0)

test('create should create a new construction', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name);
    const construction = ConstructionController.create(object3D, definition, team, isOwned, upgradeIndex)
    expect(construction.definition.name).toBe(name)
})

test('findByObject3D should find a construction by object3D', () => {
    const construction = ConstructionController.findByObject3D(object3D)
    expect(construction.definition.name).toBe(name)
})

test('findByName should find a construction by name', () => {
    const construction = ConstructionController.findByName(name)
    expect(construction.definition.name).toBe(name)
})

test('findByNameAndTeam should find a construction by name and team', () => {
    const construction = ConstructionController.findByNameAndTeam(name, team)
    expect(construction.definition.name).toBe(name)
})

test('findByNameAndUpgradeAndTeam should find a construction by name, upgrade, and team', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name);
    ConstructionController.create(object3DOther, definition, team2, isOwned, upgradeIndex)
    ConstructionController.create(object3DOther2, definition, team2, isOwned, upgradeIndex)

    const construction = ConstructionController.findByNameAndUpgradeAndTeam(name, upgradeIndex, team)
    expect(construction.definition.name).toBe(name)
})

test('findAllByName should find all constructions by name', () => {
    const constructions = ConstructionController.findAllByName(name)
    expect(constructions.length).toBe(3)
})

test('findAllByTeam should find all constructions by team', () => {
    const constructions = ConstructionController.findAllByTeam(team)
    expect(constructions.length).toBe(1)
})

test('findAllNotOnTeam should find all constructions not on the team', () => {
    const constructions = ConstructionController.findAllNotOnTeam(team)
    expect(constructions.length).toBe(2)
})

test('findAllByNameAndTeam should find all constructions by name and team', () => {
    const constructions = ConstructionController.findAllByNameAndTeam(name, team)
    expect(constructions.length).toBe(1)
})

test('findClosest should find the closest construction', () => {
    const position = new THREE.Vector3(8, 0, 0)
    const result = ConstructionController.findClosest(ConstructionController.constructions.value, position)
    expect(result.closestDistance).toBe(2)
    expect(result.construction.object3D.uuid).toBe(object3DOther.uuid)
})

test('findClosestByName should find the closest construction by name', () => {
    const position = new THREE.Vector3(8, 0, 0)
    const result = ConstructionController.findClosestByName(position, name)
    expect(result.closestDistance).toBe(2)
    expect(result.construction.object3D.uuid).toBe(object3DOther.uuid)
})

test('findClosestByNameAndTeam should find the closest construction by name and team', () => {
    const position = new THREE.Vector3(8, 0, 0)
    const result = ConstructionController.findClosestByNameAndTeam(position, name, team)
    expect(result.closestDistance).toBe(8)
    expect(result.construction.object3D.uuid).toBe(object3D.uuid)
})

test('findClosestByTeam should find the closest construction by team', () => {
    const position = new THREE.Vector3(8, 0, 0)
    const result = ConstructionController.findClosestByTeam(position, team)
    expect(result.closestDistance).toBe(8)
    expect(result.construction.object3D.uuid).toBe(object3D.uuid)
})

test('findClosestNotOnTeam should find the closest construction not on the team', () => {
    const position = new THREE.Vector3(8, 0, 0)
    const result = ConstructionController.findClosestNotOnTeam(position, team)
    expect(result.closestDistance).toBe(2)
    expect(result.construction.object3D.uuid).toBe(object3DOther.uuid)
})

test('countByName should count constructions by name', () => {
    const count = ConstructionController.countByName(name)
    expect(count).toBe(3)
})

test('countByTeam should count constructions by team', () => {
    const count = ConstructionController.countByTeam(team)
    expect(count).toBe(1)
})

test('countByNameAndTeam should count constructions by name and team', () => {
    const count = ConstructionController.countByNameAndTeam(name, team)
    expect(count).toBe(1)
})

test('countByNameAndUpgradeAndTeam should count constructions by name, upgrade, and team', () => {
    const count = ConstructionController.countByNameAndUpgradeAndTeam(name, upgradeIndex, team)
    expect(count).toBe(1)
})

test('remove should remove a construction', () => {
    ConstructionController.remove(object3D)
    expect(ConstructionController.constructions.value.length).toBe(2)
})
