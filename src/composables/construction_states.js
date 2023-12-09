import { useBank } from "./bank.js";
import { useItems } from "./items.js";
import { useHealth } from "./health.js";

class Base {
    constructor(construction, options = {}) {
        this.construction = construction;
        this.options = options;
        if (!construction) throw new Error('Construction is required');
    }

    enter() { }
    update() { }
    exit() { }
    isComplete() {
        return false;
    }
}

class Wait extends Base {
    constructor(construction, options = {}) {
        super(construction, options);
    }

    exit() {
    }

    isComplete() {
        return false
    }
}

class Timer extends Base {
    constructor(construction, options = {}) {
        super(construction, options);
        const duration = construction.userData.target || 1000;
        this.endTime = Date.now() + duration;
    }

    isComplete() {
        return Date.now() > this.endTime;
    }
}

class TrySpawn extends Base {
    constructor(construction, options = {}) {
        super(construction, options);
        if (!construction.userData.canBuild) throw new Error('Construction Spawn feature is required');
    }

    exit() {
        const time = Date.now()
        this.construction.userData.target = time + 1000;
        useItems().dequeueAny(this.construction)
    }

    isComplete() {
        return true;
    }
}

class Produce extends Base {
    constructor(construction, options = {}) {
        super(construction, options);
        if (!construction.userData.canProduce) throw new Error('Construction Produce feature is required');
    }

    exit() {
        const userData = this.construction.userData
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
                userData.target = time + 1000;
                return;
            }

            for (const cost of produceFeature.options.costs) {
                bankManager.withdraw(cost.amount, cost.currency)
            }

            bankManager.deposit(amount, currency)
            userData.target = time + produceFeature.options.speed;
        }
    }

    isComplete() {
        return true;
    }
}

class Attack extends Base {
    constructor(construction, options = {}) {
        super(construction, options);
        if (!construction.userData.canAttack) throw new Error('Construction Attack feature is required');
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
        const construction = this.construction;
        const position = construction.position;
        const userData = construction.userData;
        const team = userData.team;

        const upgrade = userData.upgrades[userData.upgrade.index];
        const attackFeature = upgrade.features.find(feature => feature.name === 'attack');

        let target = attackFeature.options.target;
        if (!target) {

            const healthObjects = this.healthManager
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
            this.healthManager.applyDamage(target, attackDamage, construction, team);
            const isDead = this.healthManager.isDead(target);
            if (isDead) attackFeature.options.target = null;
        }
    }

    exit() {
        const userData = this.construction.userData;
        const upgrade = userData.upgrades[userData.upgrade.index];
        const attackFeature = upgrade.features.find(feature => feature.name === 'attack');
        const attackRate = attackFeature.options.rate;
        const time = Date.now()

        this.construction.userData.target = time + attackRate;
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
