import Base from '../base.js'
import { useHealth } from '../../../health/health.js';

export default class DamageCheck extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    async enter() {
        const damagedHealthObjects = useHealth().findAllDamagedByTeam(this.manager.object.team);
        if (damagedHealthObjects.length > 0) {
            this.manager.object.setState('ready up for attack');
        }
    }

    isComplete() {
        return true;
    }
}
