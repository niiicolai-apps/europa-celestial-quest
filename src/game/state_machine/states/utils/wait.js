import Base from '../base.js'

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
        console.log('Wait');
    }

    exit() {
    }

    isComplete() {
        return false
    }
}
