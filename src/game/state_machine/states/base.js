
/**
 * Base class for all states
 * 
 * @export
 * @class Base
 */
export default class Base {
    constructor(manager, options = {}) {
        this.manager = manager;
        this.options = options;
        if (!manager) throw new Error('Manager is required');
    }

    enter() { }
    update() { }
    exit() { }
    isComplete() {
        return false;
    }
}
