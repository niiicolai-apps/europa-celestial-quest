import { expect, test } from 'vitest'
import UnitModel from '../../../src/game/units/unit_model.js'

test('unit model should have a object3D property', () => {
    const model = UnitModel('id', { features: [] }, {}, {})
    expect(model.object3D).not.toBe(undefined)
})

test('unit model should have a features property', () => {
    const model = UnitModel('id', { features: [] }, {}, {})
    expect(model.features).not.toBe(undefined)
})

test('unit model should have a data property', () => {
    const model = UnitModel('id', { features: [] }, {}, {})
    expect(model.data).not.toBe(undefined)
})

test('unit model should have a team property', () => {
    const model = UnitModel('id', { features: [] }, {}, {})
    expect(model.team).not.toBe(undefined)
})
