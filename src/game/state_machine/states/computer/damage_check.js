import Base from '../base.js'
import { useHealth } from '../../../health/health.js';

export default class DamageCheck extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    async enter() {
        const damagedHealthObjects = useHealth().findAllDamagedByTeam(this.manager.object.team);
        if (damagedHealthObjects.length > 0) {
            console.log('Moving to ready up for attack state')
            this.manager.object.setState('ready up for attack');
        } else {
            console.log('No damaged objects yet');
        }
    }

    isComplete() {
        return true;
    }
}
