import Base from '../Base.js'
import { useNavigation } from '../../../navigation/navigation.js';

/**
 * Move behavior.
 */
export default class MoveTo extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.features;
        const object3D = unit.object3D;
        const move = unitOptions.move;
        const destination = move ? move.destination : null;
        
        if (!move) throw new Error('Unit Move feature is required');
        if (!destination) throw new Error('Unit Move feature destination is required');

        this.nModel = useNavigation().find(object3D);
        this.nModel.setDestination(destination);
    }

    exit() {
        const manager = this.manager;
        const unit = manager.object;
        const unitOptions = unit.features;
        const move = unitOptions.move;
        move.destination = null;
    }

    isComplete() {
        return this.nModel.reachedDestination();
    }
}
