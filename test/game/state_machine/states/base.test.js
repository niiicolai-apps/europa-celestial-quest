import { expect, test } from 'vitest'
import Base from '../../../../src/game/state_machine/states/base.js'
import StateMachineModel from '../../../../src/game/state_machine/state_machine_model.js'


test('base state should have a manager property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    const base = new Base(model)
    expect(base.manager).not.toBe(undefined)
})

test('base state should have a options property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    const base = new Base(model)
    expect(base.options).not.toBe(undefined)
})

test('base state should have an enter method', () => {
    const model = StateMachineModel('id', {}, {}, {})
    const base = new Base(model)
    expect(base.enter).not.toBe(undefined)
})

test('base state should have an update method', () => {
    const model = StateMachineModel('id', {}, {}, {})
    const base = new Base(model)
    expect(base.update).not.toBe(undefined)
})

test('base state should have an exit method', () => {
    const model = StateMachineModel('id', {}, {}, {})
    const base = new Base(model)
    expect(base.exit).not.toBe(undefined)
})

test('base state should have an isComplete method', () => {
    const model = StateMachineModel('id', {}, {}, {})
    const base = new Base(model)
    expect(base.isComplete).not.toBe(undefined)
})
