import Base from '../Base.js'

export default class SetAttackCommand extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    async exit() {
    }

    isComplete() {
        return true;
    }
}
