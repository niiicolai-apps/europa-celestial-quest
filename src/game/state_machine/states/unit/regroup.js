import Base from '../Base.js'
import { useNavigation } from '../../../navigation/navigation.js';
import { useCommands } from '../../../units/commands.js';

export default class Regroup extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.features;
        const move = unitOptions.move;
        const team = unit.team;
        const command = useCommands().createOrFindCommand(team);
        
        if (!move) throw new Error('Unit Move feature is required');
        if (!command) throw new Error('Unit Command is required');

        move.destination = command.position;

        this.nModel = useNavigation().find(unit.object3D);        
        this.nModel.setAcceptableDistance(1);
        console.log('Regrouping');
    }

    isComplete() {
        return true;
    }
}