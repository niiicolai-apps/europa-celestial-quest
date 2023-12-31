import { expect, test } from 'vitest'
import StateMachineController from '../../../src/game/state_machine/state_machine_controller.js'
import Base from '../../../src/game/state_machine/states/base.js'

class BaseExtendedMock extends Base {
    constructor(manager, options = {}) {
        super(manager, options)
        this.counter = 0
    }

    update() {
        this.counter++
    }
}

test('state machine controller should have a managers property', () => {
    expect(StateMachineController.managers.value).toEqual([])
})

test('state machine controller should have a paused property', () => {
    expect(StateMachineController.paused.value).toBe(false)
})

test('create should create a new manager', () => {
    const manager = StateMachineController.create('id', {}, {}, {})
    expect(manager.data.id).toBe('id')
})

test('remove should remove a manager', () => {
    StateMachineController.remove('id')
    expect(StateMachineController.managers.value.length).toBe(0)
})

test('update should update all managers', async () => {
    const behavior = { states: [{name: 'state', actions: [{method: 'move', options: {}}]}] }
    const stateMethods = { MOVE: BaseExtendedMock }
    const manager = StateMachineController.create('id', {}, behavior, stateMethods)
    await StateMachineController.update()
    expect(manager.data.action.counter).toBe(1)
})

test('setPaused should set the paused property', () => {
    StateMachineController.setPaused(true)
    expect(StateMachineController.paused.value).toBe(true)
})

test('update should not update when paused', async () => {
    const behavior = { states: [{name: 'state', actions: [{method: 'move', options: {}}]}] }
    const stateMethods = { MOVE: BaseExtendedMock }
    const manager = StateMachineController.create('id2', {}, behavior, stateMethods)
    StateMachineController.setPaused(true)
    await StateMachineController.update()
    expect(manager.hasAction()).toBe(false)
})

test('findById should find a manager by id', () => {
    const manager = StateMachineController.findById('id')
    expect(manager.data.id).toBe('id')
})
