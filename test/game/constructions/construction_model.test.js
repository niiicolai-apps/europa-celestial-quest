import { expect, test } from 'vitest'
import ConstructionModel from '../../../src/game/constructions/construction_model.js'
import ConstructionDefinitions from '../../../src/game/definitions/constructions.js'
import * as THREE from 'three'

const name = 'Europa Horizon Drifter X1'
const name2 = 'Robot Facility'
const team = 'team-1'
const isOwned = true
const upgradeIndex = 0
const object3D = new THREE.Object3D()

test('construction model should have a object3D property', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name);
    const model = ConstructionModel(object3D, definition, team, isOwned, upgradeIndex)
    expect(model.object3D).not.toBe(undefined)
})

test('construction model should have a definition property', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name);
    const model = ConstructionModel(object3D, definition, team, isOwned, upgradeIndex)
    expect(model.definition).not.toBe(undefined)
})

test('construction model should have a features property', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name);
    const model = ConstructionModel(object3D, definition, team, isOwned, upgradeIndex)
    expect(model.features).not.toBe(undefined)
})

test('construction model should have a team property', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name);
    const model = ConstructionModel(object3D, definition, team, isOwned, upgradeIndex)
    expect(model.team).not.toBe(undefined)
})

test('construction model should have a isOwned property', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name);
    const model = ConstructionModel(object3D, definition, team, isOwned, upgradeIndex)
    expect(model.isOwned).not.toBe(undefined)
})

test('construction model should have a upgradeIndex property', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name);
    const model = ConstructionModel(object3D, definition, team, isOwned, upgradeIndex)
    expect(model.upgradeIndex).not.toBe(undefined)
})

test('isUpgradeable should return false because the construction is not upgradeable', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name);
    const model = ConstructionModel(object3D, definition, team, isOwned, upgradeIndex)
    expect(model.isUpgradeable()).toBe(false)
})

test('isUpgradeable should return true because the construction is not upgradeable', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name2);
    const model = ConstructionModel(object3D, definition, team, isOwned, upgradeIndex)
    expect(model.isUpgradeable()).toBe(true)
})

test('getUpgrade should return the current upgrade', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name2);
    const model = ConstructionModel(object3D, definition, team, isOwned, upgradeIndex)
    expect(model.getUpgrade().name).toBe('Upgrade 1')
})

test('upgradeToNext should upgrade the construction to the next upgrade', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name2);
    const model = ConstructionModel(object3D, definition, team, isOwned, upgradeIndex)
    model.upgradeToNext()
    expect(model.getUpgrade().name).toBe('Upgrade 2')
})

test('upgradeToNext should not upgrade the construction to the next upgrade because there is no next upgrade', () => {
    const definition = ConstructionDefinitions.find(definition => definition.name === name2);
    const model = ConstructionModel(object3D, definition, team, isOwned, 1)
    model.upgradeToNext()
    expect(model.getUpgrade().name).toBe('Upgrade 2')
})
