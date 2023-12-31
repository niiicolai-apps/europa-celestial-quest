import { expect, test } from 'vitest'
import Timer from '../../../../../src/game/state_machine/states/utils/timer.js'
import StateMachineModel from '../../../../../src/game/state_machine/state_machine_model.js'

test('timer should use the target property to set the length of the timer', () => {
    const model = StateMachineModel('id', {}, {}, {}, 0, null, null, {time: 5000})
    const timer = new Timer(model)
    expect(timer.length).toBe(5000)
    expect(timer.endTime).toBeGreaterThan(Date.now())
})

test('timer should use the default length when no target property is set', () => {
    const model = StateMachineModel('id', {}, {}, {}, 0, null, null, {})
    const timer = new Timer(model)
    expect(timer.length).toBe(1000)
    expect(timer.endTime).toBeGreaterThan(Date.now())
})

test('isComplete should return true when the timer has expired', () => {
    const model = StateMachineModel('id', {}, {}, {}, 0, null, null, {time: 5000})
    const timer = new Timer(model)
    const now = Date.now() + 5001
    expect(timer.isComplete(now)).toBe(true)
})

test('isComplete should return false when the timer has not expired', () => {
    const model = StateMachineModel('id', {}, {}, {}, 0, null, null, {time: 5000})
    const timer = new Timer(model)
    const now = Date.now() + 4999
    expect(timer.isComplete(now)).toBe(false)
})
