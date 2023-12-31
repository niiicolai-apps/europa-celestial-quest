import { expect, test } from 'vitest'
import Wait from '../../../../../src/game/state_machine/states/utils/wait.js'
import StateMachineModel from '../../../../../src/game/state_machine/state_machine_model.js'

test('wait should have a manager property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    const wait = new Wait(model)
    expect(wait.manager).not.toBe(undefined)
})

test('wait should always return false', () => {
    const model = StateMachineModel('id', {}, {}, {})
    const wait = new Wait(model)
    expect(wait.isComplete()).toBe(false)
})
