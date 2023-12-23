import { useBank } from "../../bank/bank.js";
import { useItems } from "../../constructions/constructions.js";
import { useUnits } from "../../units/units.js";
import { useHealth } from "../../health/health.js";
import { useParticles } from "../../particles/particles.js";
import { useParticlesPool } from "../../particles/particles_pool.js";

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
        this.manager.target = 1000;
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

        const construction = manager.object.construction
        const userData = construction.userData
        const upgrade = userData.upgrades[userData.upgrade.index]
        const produceFeature = upgrade.features.find(feature => feature.name === 'produce')
        const currency = produceFeature.options.type

        const team = manager.object.team
        const bankManager = useBank();

        this.bank = bankManager.get(team);
        this.isFull = (this.bank.getBalance(currency) >= this.bank.getMax(currency))
        this.costs = produceFeature.options.costs
        this.canAfford = !this.costs ? true : this.bank.canAfford(this.costs)
    }

    exit() {
        const manager = this.manager
        const construction = manager.object.construction
        const userData = construction.userData
        const upgrade = userData.upgrades[userData.upgrade.index]
        const produceFeature = upgrade.features.find(feature => feature.name === 'produce')
        const currency = produceFeature.options.type
        const amount = produceFeature.options.rate
        
        if (!this.isFull) {
            if (!this.canAfford) {
                manager.target = 1000;
                return;
            }

            if (this.costs) {
                for (const cost of this.costs) {
                    this.bank.withdraw(cost.amount, cost.currency)
                }
            }

            this.bank.deposit(amount, currency)
            console.log('deposit', currency, amount, this.bank)
            manager.target = produceFeature.options.speed;
        }
    }

    isComplete() {
        return true;
    }
}

class LookForEnemy extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
        if (!manager.object.canAttack) throw new Error('Manager Attack feature is required');
    }

    update() {
    }

    exit() {
        const manager = this.manager;
        const team = manager.object.team;
        const construction = manager.object.construction;
        const upgrades = construction.userData.upgrades[construction.userData.upgrade.index];
        const attackFeature = upgrades.features.find(feature => feature.name === 'attack');

        /**
         * If the attack feature already has a target, do nothing.
         */
        if (attackFeature.options.target) return;

        /**
         * Find the closest non-team construction and unit.
         */
        const closestNonTeamConstruction = useItems().findClosestNotOnTeam(construction.position, team)
        const closestNonTeamUnit = useUnits().findClosestNotOnTeam(team, construction.position).unit?.object3D
        let target = null;
        /**
         * If both a construction and unit are found,
         * choose the closest one.
         */
        if (closestNonTeamConstruction && closestNonTeamUnit) {
            const constructionDistance = construction.position.distanceTo(closestNonTeamConstruction.position)
            const unitDistance = construction.position.distanceTo(closestNonTeamUnit.position)
            target = constructionDistance < unitDistance
                ? closestNonTeamConstruction
                : closestNonTeamUnit

            /**
             * If only a construction is found, choose it.
             * If only a unit is found, choose it.
             * If neither are found, do nothing.
             */
        } else if (closestNonTeamConstruction) {
            target = closestNonTeamConstruction
        } else if (closestNonTeamUnit) {
            target = closestNonTeamUnit
        }

        /**
         * If a target is found, set it as the attack target.
         * Otherwise, do nothing.
         */
        if (target) {
            const userData = construction.userData;
            const upgrades = userData.upgrades[userData.upgrade.index];
            const attackFeature = upgrades.features.find(feature => feature.name === 'attack');
            const distance = construction.position.distanceTo(target.position);
            const attackDistance = attackFeature.options.distance;
            /**
             * Only set the target if it is within the attack distance.
             */
            if (distance <= attackDistance)
                attackFeature.options.target = target;
        }
    }

    isComplete() {
        return true;
    }
}

class Attack extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
        if (!manager.object.canAttack) throw new Error('Manager Attack feature is required');
        this.healthManager = useHealth();

        const construction = manager.object.construction;
        const userData = construction.userData;
        const upgrades = userData.upgrades[userData.upgrade.index];
        const attackFeature = upgrades.features.find(feature => feature.name === 'attack');
        const attackOptions = attackFeature.options;
        const target = attackOptions.target;
        const particlesPool = useParticlesPool();
        this.muzzleParticle = particlesPool.get(attackOptions.muzzleParticle.name);
        this.hitParticle = particlesPool.get(attackOptions.hitParticle.name);

        this.playParticles = () => {
            const particlesManager = useParticles();
            const position = null
            const direction = null
            particlesManager.play(
                this.muzzleParticle.id, 
                position, 
                direction, 
                construction, 
                target, 
                attackOptions.muzzleParticle.force
            );
            particlesManager.play(
                this.hitParticle.id, 
                position, 
                direction, 
                target 
            );
        }

        this.stopParticles = () => {
            const particlesManager = useParticles();
            particlesManager.stop(this.muzzleParticle.id);
            particlesManager.stop(this.hitParticle.id);
        }
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
        const team = manager.object.team;
        const upgrades = userData.upgrades[userData.upgrade.index];
        const attackFeature = upgrades.features.find(feature => feature.name === 'attack');
        const target = attackFeature.options.target;

        if (!target) return;

        const distance = position.distanceTo(target.position);
        const attackDistance = attackFeature.options.distance;
        const attackDamage = attackFeature.options.damage;

        if (distance <= attackDistance) {
            /**
             * Look at target.
             */
            const lookAtFeature = upgrades.features.find(feature => feature.name === 'look_at');
            if (lookAtFeature) {
                const rotateable_child_names = lookAtFeature.options.rotateable_child_names;
                construction.traverse(child => {
                    if (child.isMesh && rotateable_child_names.includes(child.name)) {
                        /**
                         * Look at target on y axis.
                         */
                        child.lookAt(target.position);
                        child.rotateY(Math.PI);
                    }
                });
            }

            /**
             * Attack target.
             */
            healthManager.applyDamage(target, attackDamage, construction, team);

            /**
             * Play particles.
             */
            this.playParticles();

            /**
             * If the target is dead, remove it from the attack feature.
             * Otherwise, do nothing.
             */
            const isDead = healthManager.isDead(target);
            if (isDead) attackFeature.options.target = null;
        } else {
            attackFeature.options.target = null;
        }
    }

    exit() {
        const manager = this.manager;
        const construction = manager.object.construction;
        const userData = construction.userData;
        const upgrade = userData.upgrades[userData.upgrade.index];
        const attackFeature = upgrade.features.find(feature => feature.name === 'attack');
        const attackRate = attackFeature.options.rate;

        manager.target = attackRate;
        this.stopParticles();
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
    LOOK_FOR_ENEMY: LookForEnemy,
    ATTACK: Attack,
}
