import { useItems } from '../../constructions/constructions.js';
import { useUnits } from '../../units/units.js';
import UNITS from '../../definitions/units.js';

class Base {
    constructor(manager, options = {}) {
        this.manager = manager;
        this.options = options;
        if (!manager) throw new Error('Manager is required');
    }

    enter() { }
    update() { }
    exit() { }
    isComplete() {
        return false;
    }
}

class Wait extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    exit() {
    }

    isComplete() {
        return false
    }
}

class Timer extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
        const duration = manager.target || 1000;
        this.endTime = Date.now() + duration;
    }

    isComplete() {
        return Date.now() > this.endTime;
    }
}

class SpawnArmy extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    async exit() {
        const unitsManager = useUnits();
        const itemsManager = useItems();
        const manager = this.manager;
        const player = manager.object;
        const options = this.options;
        const army = options.army;
        const team = player.team;

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
            const unit = await player.spawnUnit(unitData);

            unit.position.copy(randomConstruction.position);
        }

        manager.target = options.attack.build_speed;
    }

    isComplete() {
        return true;
    }
}

class SetAttackCommand extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    async exit() {
    }

    isComplete() {
        return true;
    }
}

class AttackCheck extends Base {
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
            player.setUnitsStateByPrimaryFunction('attack');
            player.setState('attack');
            console.log('Setting attack command');
        }
        else if (!allUnitsSpawned && manager.state.name === 'attack') {
            player.setUnitsStateByPrimaryFunction('build first army');
            player.setState('build first army');
            console.log('Setting build army command');
        } else {
            console.log('Waiting for army');
        }
    }

    isComplete() {
        return true;
    }
}

export default {
    WAIT: Wait,
    TIMER: Timer,
    SPAWN_ARMY: SpawnArmy,
    SET_ATTACK_COMMAND: SetAttackCommand,
    ATTACK_CHECK: AttackCheck,
}