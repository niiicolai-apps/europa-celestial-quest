import { useNavigation } from "../../navigation/navigation.js";
import { useParticles } from "../../particles/particles.js";
import { useParticlesPool } from "../../particles/particles_pool.js";
import { useHealth } from "../../health/health.js";
import { useStateMachine } from "../state_machine.js";

import Base from './base.js';
import Wait from './utils/wait.js';
import Timer from './utils/timer.js';
import MoveTo from './unit/move_to.js';
import Collect from './unit/collect.js';
import Deliver from './unit/deliver.js';
import FindClosest from './unit/find_closest.js';
import FindRandom from './unit/find_random.js';
import Regroup from "./unit/regroup.js";

/**
 * Move Attack behavior.
 * 
 * Follows the same move behavior,
 * but ensures the unit is within
 * attack distance of the target.
 */
class MoveToAttack extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.features;
        const attack = unitOptions.attack;
        const move = unitOptions.move;
        const target = manager.target;
        if (!attack) throw new Error('Unit Attack feature is required');
        if (!target) throw new Error('Manager target is required');
        if (!move) throw new Error('Unit Move feature is required');
        

        this.nModel = useNavigation().find(object3D);        
        this.nModel.setAcceptableDistance(attack.distance);
        this.nModel.setDestination(target.position);
    }

    isComplete() {
        return this.nModel.reachedDestination();
    }
}

class MoveToTarget extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.options;
        const move = unitOptions.move;
        const target = manager.target;
        if (!move) throw new Error('Unit Move feature is required');
        if (!target) throw new Error('Manager target is required');
    }

    exit() {
        const manager = this.manager;
        const unit = manager.object;
        const unitOptions = unit.options;
        const managerTarget = manager.target;

        unitOptions.move.destination = managerTarget.position;
    }

    isComplete() {
        return true;
    }
}

class DefendPosition extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.features;
        const attack = unitOptions.attack;
        if (!attack) throw new Error('Unit Attack feature is required');
        this.attackDistance = attack.distance;
    }

    exit() {
        /**
         * Check if there are any enemies nearby.
         */
        const healthManager = useHealth();
        const manager = this.manager;
        const unit = manager.object;
        const team = unit.team;
        const position = unit.object3D.position;
        const closestResult = healthManager.findClosestNotOnTeam(team, position);
        const closestObject = closestResult?.healthObject?.object3D;
        const closestDistance = closestResult?.closestDistance;
        const shouldAttack = closestObject && closestDistance < this.attackDistance;
        /**
         * Set the state to attack if there are enemies nearby.
         * And set the target to the closest enemy.
         * Otherwise, do nothing.
         */
        if (shouldAttack) {
            manager.state = manager.behavior.states.find(s => s.name === 'attack');
            manager.target = closestObject;
        }
    }

    isComplete() {
        return true;
    }
}

/**
 * Attack behavior.
 */
class Attack extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.features;
        const attack = unitOptions.attack;
        const target = manager.target;
        if (!attack) throw new Error('Unit Attack feature is required');
        if (!target) throw new Error('Manager target is required');

        this.distance = attack.distance;
        this.rate = attack.rate;
        this.damage = attack.damage;
        this.nextAttack = Date.now();
        this.healthManager = useHealth();

        const particlesPool = useParticlesPool();
        this.muzzleParticle = particlesPool.get(attack.muzzleParticle.name);
        this.hitParticle = particlesPool.get(attack.hitParticle.name);

        this.playParticles = () => {
            const particlesManager = useParticles();
            const position = null
            const direction = null
            particlesManager.play(
                this.muzzleParticle.id,
                position,
                direction,
                unit.object3D,
                target,
                attack.muzzleParticle.force
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

    resetAttack() {
        this.nextAttack = Date.now() + this.rate;
    }

    attack() {
        if (!this.manager.target) return;

        const manager = this.manager;
        const unit = manager.object;
        const object3D = unit.object3D;
        const target = manager.target;
        const team = unit.team;
        const damage = this.damage;
        const distance = object3D.position.distanceTo(target.position);

        if (distance < this.distance) {
            this.playParticles();
            this.resetAttack();
            this.healthManager.applyDamage(
                target,
                damage,
                object3D,
                team
            );
        }

        const targetIsDead = this.healthManager.isDead(target);
        if (targetIsDead) {
            manager.target = null;
        }
    }

    update() {
        if (Date.now() > this.nextAttack) {
            this.attack();
        }
    }

    exit() {
        this.stopParticles();
    }

    isComplete() {
        const manager = this.manager;
        const target = manager.target;
        if (!target) return true;

        const unit = manager.object;
        const object3D = unit.object3D;
        const distance = object3D.position.distanceTo(target.position);
        return distance > this.distance;
    }
}

/**
 * Defend Attack behavior.
 * 
 * Used by units currently regrouped at a position,
 * but are being attacked by an enemy.
 * The unit follows the normal attack behavior,
 * but when the attack is complete, the unit
 * returns to the regroup position.
 */
class DefendAttack extends Attack {
    constructor(manager, options = {}) {
        super(manager, options);
    }

    exit() {
        super.exit();

        if (!this.manager.target) {
            useStateMachine().setState(this.manager.object.object3D.uuid, 'defend');
        }
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
    DEFEND_POSITION: DefendPosition,
    ATTACK: Attack,
    MOVE_TO_TARGET: MoveToTarget,
    MOVE_TO_ATTACK: MoveToAttack,
    DEFEND_ATTACK: DefendAttack
}
