import { useHealth } from '../../../health/health.js'
import { useParticles } from '../../../particles/particles.js'
import { useParticlesPool } from '../../../particles/particles_pool.js'

import Base from '../base.js'

export default class Attack extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
        
        if (!manager.object.features.attack) 
            throw new Error('Manager Attack feature is required');

        this.noTarget = false;
        this.healthManager = useHealth();

        const construction = manager.object;
        const upgrade = construction.getUpgrade();
        
        this.attackFeature = upgrade.features.find(feature => feature.name === 'attack');
        
        const attackOptions = this.attackFeature.options;
        const particlesPool = useParticlesPool();
        
        //this.muzzleParticle = particlesPool.get(attackOptions.muzzleParticle.name);
        //this.hitParticle = particlesPool.get(attackOptions.hitParticle.name);
        /*
        this.playParticles = () => {
            const particlesManager = useParticles();
            const position = null
            const direction = null
            particlesManager.play(
                this.muzzleParticle.id,
                position,
                direction,
                construction,
                attackOptions.target,
                attackOptions.muzzleParticle.force
            );
            particlesManager.play(
                this.hitParticle.id,
                position,
                direction,
                attackOptions.target
            );
        }

        this.stopParticles = () => {
            const particlesManager = useParticles();
            particlesManager.stop(this.muzzleParticle.id);
            particlesManager.stop(this.hitParticle.id);
        }*/
    }

    update() {
        const manager = this.manager;
        const construction = manager.object;
        const object3D = construction.object3D;
        const position = object3D.position;
        const team = construction.team;
        const target = this.attackFeature.options.target;

        if (!target) return;

        const distance = position.distanceTo(target.position);
        const attackDistance = this.attackFeature.options.distance;
        const attackDamage = this.attackFeature.options.damage;
        
        if (distance <= attackDistance) {
            /**
             * Look at target.
             */
            
            const upgrade = construction.getUpgrade();
            const lookAtFeature = upgrade.features.find(feature => feature.name === 'look_at');
            if (lookAtFeature) {
                const rotateable_child_names = lookAtFeature.options.rotateable_child_names;
                object3D.traverse(child => {
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
            this.healthManager.applyDamage(target, attackDamage, object3D, team);

            /**
             * Play particles.
             */
            //this.playParticles();

            /**
             * If the target is dead, remove it from the attack feature.
             * Otherwise, do nothing.
             */
            const isDead = this.healthManager.isDead(target);
            if (isDead) {
                this.attackFeature.options.target = null;
                this.noTarget = true;
            }
        } else {
            this.attackFeature.options.target = null;
            this.noTarget = true;
        }
    }

    exit() {
        //this.stopParticles();
    }

    isComplete() {
        return this.noTarget;
    }
}
