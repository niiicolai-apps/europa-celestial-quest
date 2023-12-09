import { useBank } from "../bank.js";
import { useItems } from "../constructions.js";
import { useHealth } from "../health.js";

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

class TrySpawn extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
        if (!manager.object.canBuild) throw new Error('Manager Spawn feature is required');
    }

    exit() {
        const time = Date.now()
        this.manager.target = time + 1000;
        useItems().dequeueAny(this.manager.object.construction)
    }

    isComplete() {
        return true;
    }
}

class Produce extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
        if (!manager.object.canProduce) throw new Error('Manager Produce feature is required');
    }

    exit() {
        const manager = this.manager
        const construction = manager.object.construction
        const userData = construction.userData
        const upgrade = userData.upgrades[userData.upgrade.index]
        const produceFeature = upgrade.features.find(feature => feature.name === 'produce')
        const currency = produceFeature.options.type
        const amount = produceFeature.options.rate
        const bankManager = useBank()
        const isFull = (bankManager.getBalance(currency) >= bankManager.getCurrency(currency).max)
        const time = Date.now()

        if (!isFull) {
            const canAfford = bankManager.canAfford(produceFeature.options.costs)
            if (!canAfford) {
                manager.target = time + 1000;
                return;
            }

            for (const cost of produceFeature.options.costs) {
                bankManager.withdraw(cost.amount, cost.currency)
            }

            bankManager.deposit(amount, currency)
            manager.target = time + produceFeature.options.speed;
        }
    }

    isComplete() {
        return true;
    }
}

class Attack extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
        if (!manager.canAttack) throw new Error('Manager Attack feature is required');
        this.healthManager = useHealth();
    }

    findClosestObject(objects, position) {
        let closest = null;
        let closestDistance = Infinity;
        for (const object of objects) {
            const distance = object.position.distanceTo(position);
            if (distance < closestDistance) {
                closest = object;
                closestDistance = distance;
            }
        }
        return { object: closest, closestDistance };
    }

    update() {
        const manager = this.manager;
        const construction = manager.object.construction;
        const position = construction.position;
        const userData = construction.userData;
        const healthManager = this.healthManager;
        const team = manager.team;

        const upgrade = userData.upgrades[userData.upgrade.index];
        const attackFeature = upgrade.features.find(feature => feature.name === 'attack');

        let target = attackFeature.options.target;
        if (!target) {

            const healthObjects = healthManager
                .findAllNotOnTeam(team)
                .map(h => h.object3D);

            if (healthObjects.length === 0) {
                return;
            }

            target = this.findClosestObject(healthObjects, position).object;
            attackFeature.options.target = target;
        }

        if (!target) return;

        const distance = position.distanceTo(target.position);
        const attackDistance = attackFeature.options.distance;
        const attackDamage = attackFeature.options.damage;

        if (distance <= attackDistance) {
            healthManager.applyDamage(target, attackDamage, construction, team);
            const isDead = healthManager.isDead(target);
            if (isDead) attackFeature.options.target = null;
        }
    }

    exit() {
        const manager = this.manager;
        const construction = manager.object.construction;
        const userData = construction.userData;
        const upgrade = userData.upgrades[userData.upgrade.index];
        const attackFeature = upgrade.features.find(feature => feature.name === 'attack');
        const attackRate = attackFeature.options.rate;
        const time = Date.now()

        manager.target = time + attackRate;
    }

    isComplete() {
        return true;
    }
}

export default {
    WAIT: Wait,
    TIMER: Timer,
    TRY_SPAWN: TrySpawn,
    PRODUCE: Produce,
    ATTACK: Attack,
}
