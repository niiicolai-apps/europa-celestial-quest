import Base from '../Base.js'
import { useStateMachine } from '../../../state_machine/state_machine.js';

/**
 * Wait state
 * 
 * @class Wait
 * @extends {Base}
 * @param {object} manager
 * @param {object} options
 */
export default class Wait extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
        
    }

    enter() {
        useStateMachine().setState(this.manager.object.object3D.uuid, this.options.stateName);
    }

    exit() {
    }

    isComplete() {
        return false
    }
}
