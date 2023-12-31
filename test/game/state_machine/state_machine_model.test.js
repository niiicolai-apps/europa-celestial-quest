import { expect, test } from 'vitest'
import StateMachineModel from '../../../src/game/state_machine/state_machine_model.js'
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

class BaseExtended2Mock extends Base {
    constructor(manager, options = {}) {
        super(manager, options)
    }

    isComplete() {
        return true
    }
}

test('state machine model should have an data property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    expect(model.data).not.toBe(undefined)
})

test('state machine model should have an id property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    expect(model.data.id).toBe('id')
})

test('state machine model should have an object property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    expect(model.data.object).toEqual({})
})

test('state machine model should have a behavior property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    expect(model.data.behavior).toEqual({})
})

test('state machine model should have a stateMethods property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    expect(model.data.stateMethods).toEqual({})
})

test('state machine model should have an actionIndex property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    expect(model.data.actionIndex).toBe(0)
})

test('state machine model should have an action property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    expect(model.data.action).toBe(null)
})

test('state machine model should have a state property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    expect(model.data.state).toBe(null)
})

test('state machine model should have a target property', () => {
    const model = StateMachineModel('id', {}, {}, {})
    expect(model.data.target).toBe(null)
})

test('setState should set the state property of a state machine model', () => {
    const behavior = { states: [{name: 'state'}, {name: 'state2'}] }
    const model = StateMachineModel('id', {}, behavior, {})
    model.setState(1)
    expect(model.data.state.name).toBe('state2')
})

test('hasState should return true if the state property is not null', () => {
    const behavior = { states: [{name: 'state'}, {name: 'state2'}] }
    const model = StateMachineModel('id', {}, behavior, {})
    model.setState(1)
    expect(model.hasState()).toBe(true)
})

test('hasState should return false if the state property is null', () => {
    const behavior = { states: [{name: 'state'}, {name: 'state2'}] }
    const model = StateMachineModel('id', {}, behavior, {})
    expect(model.hasState()).toBe(false)
})

test('setAction should set the action property of a state machine model', async () => {
    const behavior = { states: [{name: 'state', actions: [{method: 'move', options: {}}]}] }
    const stateMethods = { MOVE: Base }
    const model = StateMachineModel('id', {}, behavior, stateMethods)
    model.setState(0)
    await model.setAction(0)
    expect(model.data.action).toBeInstanceOf(Base)
})

test('hasAction should return true if the action property is not null', async () => {
    const behavior = { states: [{name: 'state', actions: [{method: 'move', options: {}}]}] }
    const stateMethods = { MOVE: Base }
    const model = StateMachineModel('id', {}, behavior, stateMethods)
    model.setState(0)
    await model.setAction(0)
    expect(model.hasAction()).toBe(true)
})

test('hasAction should return false if the action property is null', async () => {
    const behavior = { states: [{name: 'state', actions: [{method: 'move', options: {}}]}] }
    const stateMethods = { MOVE: Base }
    const model = StateMachineModel('id', {}, behavior, stateMethods)
    model.setState(0)
    expect(model.hasAction()).toBe(false)
})

test('moveToNextAction should set the action property of a state machine model to the next action', async () => {
    const behavior = { states: [{name: 'state', actions: [{method: 'move', options: {}}, {method: 'collect', options: {}}]}] }
    const stateMethods = { MOVE: Base, COLLECT: BaseExtendedMock }
    const model = StateMachineModel('id', {}, behavior, stateMethods)
    model.setState(0)
    await model.setAction(0)
    await model.moveToNextAction(model)
    expect(model.data.action).toBeInstanceOf(BaseExtendedMock)
})

test('update should ensure the state and action properties are set', async () => {
    const behavior = { states: [{name: 'state', actions: [{method: 'move', options: {}}]}] }
    const stateMethods = { MOVE: Base }
    const model = StateMachineModel('id', {}, behavior, stateMethods)
    await model.update()
    expect(model.data.state).toBeInstanceOf(Object)
    expect(model.data.action).toBeInstanceOf(Base)
})

test('update should call the update method of the action property', async () => {
    const behavior = { states: [{name: 'state', actions: [{method: 'move', options: {}}]}] }
    const stateMethods = { MOVE: BaseExtendedMock }
    const model = StateMachineModel('id', {}, behavior, stateMethods)
    await model.update()
    expect(model.data.action.counter).toBe(1)
})

test('update should move to the next action if the action is complete', async () => {
    const behavior = { states: [{name: 'state', actions: [{method: 'move', options: {}}, {method: 'collect', options: {}}]}] }
    const stateMethods = { MOVE: BaseExtended2Mock, COLLECT: BaseExtendedMock }
    const model = StateMachineModel('id', {}, behavior, stateMethods)
    model.setState(0)
    await model.setAction( 0)
    await model.update()
    expect(model.data.action.counter).toBe(1)
    expect(model.data.actionIndex).toBe(1)
})
