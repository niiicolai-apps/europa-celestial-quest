import Base from '../Base.js'
import { useUnits } from '../../../units/units.js';

export default class AttackCheck extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    async exit() {
        let allUnitsSpawned = true;
        const unitsManager = useUnits();
        const manager = this.manager;
        const player = manager.object;
        const options = this.options;
        const army = options.army;
        const team = player.team;

        if (army) {
            for (const solider of army) {
                const unitCount = unitsManager.countByNameAndTeam(solider.name, team);
                if (unitCount >= solider.count) {
                    continue;
                }

                allUnitsSpawned = false;
                break;
            }
        }
        
        if (allUnitsSpawned && manager.state.name !== 'attack') {
            //player.setUnitsStateByPrimaryFunction('attack');
            //player.setState('attack');
            console.log('Setting attack command');
        }
        else if (!allUnitsSpawned && manager.state.name === 'attack') {
            //player.setUnitsStateByPrimaryFunction('build first army');
            //player.setState('build first army');
            console.log('Setting build army command');
        } else {
            console.log('Waiting for army');
        }
    }

    isComplete() {
        return true;
    }
}