import Base from '../base.js'
import { useHealth } from '../../../health/health.js';
import { useParticles } from '../../../particles/particles.js';
import { useParticlesPool } from '../../../particles/particles_pool.js';

/**
 * Attack behavior.
 */
export default class Attack extends Base {
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