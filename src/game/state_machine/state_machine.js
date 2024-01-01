import { useManager } from '../managers/manager.js'
import StateMachineController from './state_machine_controller.js'
import StateMachineModel from './state_machine_model.js'

/**
 * Manager methods.
 * Will be called by the manager.
 */ 
useManager().create('statemachine', {
    update: {
        priority: 1,
        callback: async () => await StateMachineController.update()
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => StateMachineController.setPaused(true)
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => StateMachineController.setPaused(false)
    }
})

/**
 * State machine interface.
 * 
 * @returns {object}
 */
export const useStateMachine = () => {

    const add = (object, id=Date.now(), behavior={}, states={}, model=StateMachineModel) => {
        return StateMachineController.create(id, object, behavior, states, model);
    }

    const remove = (id) => {
        return StateMachineController.remove(id);
    }

    const getById = (id) => {
        return StateMachineController.findById(id);
    }

    const setState = (id, stateName, target=null) => {
        return StateMachineController.setState(id, stateName, target);
    }

    return {
        add,
        remove,
        getById,
        setState,
    }
}
