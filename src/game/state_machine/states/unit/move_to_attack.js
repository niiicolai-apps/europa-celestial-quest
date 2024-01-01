import Base from '../base.js'
import { useNavigation } from '../../../navigation/navigation.js';

/**
 * Move Attack behavior.
 * 
 * Follows the same move behavior,
 * but ensures the unit is within
 * attack distance of the target.
 */
export default class MoveToAttack extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.features;
        const attack = unitOptions.attack;
        const move = unitOptions.move;
        const target = manager.target;

        if (!attack) throw new Error('Unit Attack feature is required');
        if (!move) throw new Error('Unit Move feature is required');
        if (!target) throw new Error('Manager target is required');
        

        this.nModel = useNavigation().find(unit.object3D);        
        this.nModel.setAcceptableDistance(attack.distance - 1);
        this.nModel.setDestination(target.position);
    }

    isComplete() {
        return this.nModel.reachedDestination();
    }
}