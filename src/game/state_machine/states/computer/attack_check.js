import Base from '../Base.js'
import { useHealth } from '../../../health/health.js';

export default class AttackCheck extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    async enter() {
        console.log('Starting attack check state')
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
            console.log('All warriors is dead, Moving to ready up for attack state')
            this.manager.object.setUnitsStateByPrimaryFunction('regroup');
            this.manager.object.setUnitsCommand('regroup');
            this.manager.object.setState('ready up for attack');
        } else {
            console.log('Warriors still alive');
        }
    }

    isComplete() {
        return false;
    }
}