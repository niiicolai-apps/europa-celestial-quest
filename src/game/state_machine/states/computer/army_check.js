import Base from '../base.js'
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

        let allUnitsSpawned = false;
        if (army) {
            allUnitsSpawned = true;
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
            this.manager.object.setState('attack', warriors);
        }
    }

    isComplete() {
        return true;
    }
}
