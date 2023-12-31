import Base from '../Base.js'
import { useUnits } from '../../../units/units.js';
import { useItems } from '../../../constructions/constructions.js';

export default class ArmyCheck extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    async enter() {
        const unitsManager = useUnits();
        const itemsManager = useItems();
        const army = this.options.army;
        const team = this.manager.object.team;

        let allUnitsSpawned = true;
        if (army) {
            for (const solider of army) {
                const construction = itemsManager.findByNameAndTeam(solider.construction, team);
                /**
                 * If the computer cannot spawn the unit because the construction does not exist
                 * it will just skip it and continue to the next unit.
                 */
                if (!construction) {
                    continue;
                }

                /**
                 * If the unit count is greater than or equal to the count required
                 * then continue to the next unit.
                 */
                const unitCount = unitsManager.countByNameAndTeam(solider.name, team);         
                console.log('unitCount', unitCount)       
                if (unitCount >= solider.count) {
                    continue;
                }

                /**
                 * Otherwise, the computer is still waiting for the unit to spawn.
                 */
                allUnitsSpawned = false;
                break;
            }
        }

        if (allUnitsSpawned) {
            /**
             * Add the current units to the attack state.
             */
            const units = unitsManager.findAllByTeam(team);
            const warriors = units.filter(u => u.data.primary_function === 'warrior');
            console.log('Moving to attack state')
            this.manager.object.setState('attack', warriors);
        } else {
            console.log('Army not ready yet');
        }
    }

    isComplete() {
        return true;
    }
}
