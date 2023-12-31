import Base from '../Base.js'
import { useHealth } from '../../../health/health.js';
import { useStateMachine } from '../../../state_machine/state_machine.js';

export default class DefendPosition extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const attack = unit.features.attack;
        const move = unit.features.move;
        if (!attack) throw new Error('Unit Attack feature is required');
        if (!move) throw new Error('Unit Move feature is required');

        this.detectDistance = attack.detect;
    }

    async update() {
        /**
         * Check if there are any enemies nearby.
         */
        const healthManager = useHealth();
        const manager = this.manager;
        const unit = manager.object;
        const team = unit.team;
        const position = unit.object3D.position;
        const move = unit.features.move;
        const closestResult = healthManager.findClosestNotOnTeam(team, position);
        const closestObject = closestResult?.closest?.object3D;
        const closestDistance = closestResult?.closestDistance;
        const shouldAttack = closestObject && closestDistance < this.detectDistance;
        
        /**
         * Set the state to attack if there are enemies nearby.
         * And set the target to the closest enemy.
         * Otherwise, do nothing.
         */
        if (shouldAttack) {
            console.log('Defend Attack', closestObject);
            await useStateMachine().setState(unit.object3D.uuid, 'defend', closestObject);
            move.destination = closestObject.position;
        }
    }

    isComplete() {
        return false;
    }
}