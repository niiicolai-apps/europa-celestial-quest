import Base from '../base.js'
import { useUnits } from '../../../units/units.js';
import { useItems } from '../../../constructions/constructions.js';
import UNITS from '../../../definitions/units.js'

export default class SpawnArmy extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    async enter() {
        const unitsManager = useUnits();
        const itemsManager = useItems();
        const manager = this.manager;
        const options = this.options;
        const player = manager.object;
        const army = options.army;
        const team = player.team;

        let time = 1000;
        for (const solider of army) {
            const unitCount = unitsManager.countByNameAndTeam(solider.name, team);
            
            if (unitCount > solider.count) {
                continue;
            }

            const construtions = itemsManager.findAllByNameAndTeam(solider.construction, team);
            if (construtions.length === 0) {
                continue;
            }

            const randomIndex = Math.floor(Math.random() * construtions.length);
            const randomConstruction = construtions[randomIndex];
            const unitName = solider.name.toUpperCase();
            const unitData = Object.values(UNITS).find(u => u.name === unitName);
            const unit = await player.spawnUnit(unitData, null, true);

            unit.position.copy(randomConstruction.object3D.position);
            time = solider.build_time;
            break;
        }

        manager.target = { time };
    }

    isComplete() {
        return true;
    }
}
