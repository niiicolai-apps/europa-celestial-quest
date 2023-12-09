import { useResources } from "./resources.js";
import { useNavigation } from "./navigation.js";
import { useBank } from "./bank.js";
import { useItems } from "./items.js";
import { useUnits } from "./units.js";
import { useHealth } from "./health.js";

class Base {
    constructor(unit, options={}) {
        this.unit = unit;
        this.options = options;
        if (!unit) throw new Error('Unit is required');
    }

    enter() { }
    update() { }
    exit() { }
    isComplete() {
        return false;
    }
}

class Wait extends Base {
    constructor(unit, options={}) {
        super(unit, options);
    }

    exit() {
    }

    isComplete() {
        return false
    }
}

class Timer extends Base {
    constructor(unit, options={}) {
        super(unit, options);
        this.endTime = Date.now();
    }

    isComplete() {
        return Date.now() > this.endTime;
    }
}

class MoveTo extends Base {
    constructor(unit, options={}) {
        super(unit, options);
        if (!unit.options.move) throw new Error('Unit Move feature is required');
        if (!unit.options.move.destination) throw new Error('Unit Move feature destination is required');
    }

    update() {
        const object3D = this.unit.object3D;
        const speed = this.unit.options.move.speed;
        const destination = this.unit.options.move.destination;
        const groundOffset = this.unit.options.move.groundOffset;

        useNavigation().addAgent(object3D, destination, speed, groundOffset);
    }

    isComplete() {
        const object3D = this.unit.object3D;
        const destination = this.unit.options.move.destination;
        return useNavigation().reachedDestination(object3D, destination, 15);
    }
}

class MoveToTarget extends Base {
    constructor(unit, options={}) {
        super(unit, options);
        if (!unit.options.move) throw new Error('Unit Move feature is required');
        if (!unit.target) throw new Error('Unit target is required');
    }

    exit() {
        this.unit.options.move.destination = this.unit.target.position;
    }

    isComplete() {
        return true;
    }
}

class FindClosest extends Base {
    constructor(unit, options={}) {
        super(unit, options);
        this.target = null;
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
        const type = this.options.type;
        const position = this.unit.object3D.position;

        if (type === 'resource') {
            const targetType = this.unit.options.collect.type;
            this.target = useResources().findClosest(position, targetType);
        }
        else if (type === 'construction') {
            const targetType = this.unit.options.collect
                ? this.unit.options.collect.deliver_construction
                : this.unit.options.scan.deliver_construction;
            this.target = useItems().findClosestItem(position, targetType);
        } else if (type === 'enemy') {
            const healthObjects = useHealth()
                .findAllNotOnTeam(this.unit.team)
                .map(h => h.object3D);

            if (healthObjects.length === 0) {
                console.log('No health objects found, regrouping');
                useUnits().setStateByFunction('warrior', 'regroup', this.unit.team);
                return;
            }
            const closest = this.findClosestObject(healthObjects, position);
            this.target = closest.object;
        }
    }

    exit() {
        if (!this.target) return;

        if (this.unit.options.collect) {
            this.unit.options.collect.target = this.target;
            this.unit.target = this.unit.options.collect.speed;
        }
        else if (this.unit.options.scan) {
            this.unit.options.scan.target = this.target;
            this.unit.target = this.unit.options.scan.speed;
        }
        else if (this.unit.options.attack) {
            this.unit.target = this.target;
        }
        
        this.unit.options.move.destination = this.target.position;
    }

    isComplete() {
        return !!this.target;
    }
}

class FindRandom extends Base {
    constructor(unit, options={}) {
        super(unit, options);
        this.target = null;
    }

    update() {
        const type = this.options.type;
        const position = this.unit.object3D.position;

        if (type === 'resource') {
            this.target = useResources().getRandom().object3D;
        }
        else if (type === 'construction') {
            const targetType = this.unit.options.scan.deliver_construction;
            this.target = useItems().findClosestItem(position, targetType);
        }
    }

    exit() {
        if (!this.target) return;

        if (this.unit.options.collect) {
            this.unit.options.collect.target = this.target;
            this.unit.target = this.unit.options.collect.speed;
        }
        else if (this.unit.options.scan) {
            this.unit.options.scan.target = this.target;
            this.unit.target = this.unit.options.scan.speed;
        }
        
        this.unit.options.move.destination = this.target.position;
    }

    isComplete() {
        return !!this.target;
    }
}

class Collect extends Timer {
    constructor(unit, options = {}) {
        super(unit, options);
        this.costs = this.unit.options.collect
            ? this.unit.options.collect.costs
            : this.unit.options.scan.costs;
    }

    exit() {
        if (this.costs) {
            for (const cost of this.costs) {
                useBank().withdraw(cost.amount, cost.currency);
            }
        }
    }

    isComplete() {
        const timerIsComplete = super.isComplete();
        let canAfford = true;
        if (this.costs) {
            canAfford = useBank().canAfford(this.costs);
        }
        console.log('Collect', timerIsComplete, canAfford);
        return (timerIsComplete && canAfford);
    }
}

class Deliver extends Base {
    constructor(unit, options = {}) {
        super(unit, options);
        this.amount = this.unit.options.collect
            ? this.unit.options.collect.max
            : this.unit.options.scan.rate;

        this.type = this.unit.options.collect
            ? this.unit.options.collect.type
            : this.unit.options.scan.type;
    }

    exit() {
        useBank().deposit(this.amount, this.type);
    }

    isComplete() {
        return true
    }
}

class Regroup extends Base {
    constructor(unit, options = {}) {
        super(unit, options);
        this.unit.options.move.destination = options.command.position;
    }

    update() {
    }

    exit() {
    }

    isComplete() {
        return true;
    }
}

class Attack extends Base {
    constructor(unit, options = {}) {
        super(unit, options);
        this.distance = this.unit.options.attack.distance;
        this.rate = this.unit.options.attack.rate;
        this.damage = this.unit.options.attack.damage;
        this.nextAttack = Date.now();
        this.healthManager = useHealth();
    }

    resetAttack() {
        this.nextAttack = Date.now() + this.rate;
    }

    attack() {
        if (!this.unit.target) return;
        const target = this.unit.target;
        const distance = this.unit.object3D.position.distanceTo(target.position);

        if (distance < this.distance) {
            this.resetAttack();
            this.healthManager.applyDamage(target, this.damage, this.unit.object3D, this.unit.team);
            
            const targetIsDead = this.healthManager.isDead(target);
            if (targetIsDead) {
                this.unit.target = null;
            }
        }
    }

    update() {
        if (Date.now() > this.nextAttack) {
            this.attack();
        }
    }

    exit() {
    }

    isComplete() {
        const target = this.unit.target;
        if (!target) return true;
        
        const distance = this.unit.object3D.position.distanceTo(target.position);
        return distance > this.distance;
    }
}

export default {
    TIMER: Timer,
    MOVE_TO: MoveTo,
    FIND_CLOSEST: FindClosest,
    FIND_RANDOM: FindRandom,
    COLLECT: Collect,
    DELIVER: Deliver,
    WAIT: Wait,
    REGROUP: Regroup,
    ATTACK: Attack,
    MOVE_TO_TARGET: MoveToTarget,
}
