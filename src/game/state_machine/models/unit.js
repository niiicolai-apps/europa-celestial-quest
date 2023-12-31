import StateMachineModel from '../state_machine_model.js'

export default (
    id,
    object,
    behavior,
    stateMethods,
    actionIndex = 0,
    action = null,
    state = null,
    target = null
) => {
    const model = StateMachineModel(id, object, behavior, stateMethods, actionIndex, action, state, target)

    return {
        ...model
    }
}
