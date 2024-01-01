import Base from '../base.js'
import { useHealth } from '../../../health/health.js';

export default class AttackCheck extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    async enter() {
        this.manager.object.setUnitsStateByPrimaryFunction('attack');
        this.manager.object.setUnitsCommand('attack');
    }

    async update() {
        const healthManager = useHealth();
        let allWarriorsDead = true;

        if (this.manager.target instanceof Array) {
            for (const warrior of this.manager.target) {
                if (healthManager.isDead(warrior.object3D)) {
                    continue;
                }

                allWarriorsDead = false;
                break;
            }
        }

        if (allWarriorsDead) {
            this.manager.object.setUnitsStateByPrimaryFunction('regroup');
            this.manager.object.setUnitsCommand('regroup');
            this.manager.object.setState('ready up for attack');
        }
    }

    isComplete() {
        return false;
    }
}