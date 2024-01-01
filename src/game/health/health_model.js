import BarModel from './bar_model.js';
import { ref } from 'vue';

/**
 * Apply damage to health properties
 * 
 * @param {number} currentHealth
 * @param {string} team
 * @param {number} attackerDamage
 * @param {string} attackerTeam
 * @returns {object} { currentHealth, isDead, time }
 * @throws {Error} Cannot damage own team
 */
const applyDamage = (currentHealth, team='player', attackerDamage=1, attackerTeam='other') => {
    if (team === attackerTeam) {
        throw new Error('Cannot damage own team');
    }

    currentHealth -= attackerDamage;
    if (currentHealth < 0) {
        currentHealth = 0;
    }

    return {
        currentHealth,        
        isDead: currentHealth <= 0,
        time: Date.now()
    }
}

/**
 * Check if health is dead
 * 
 * @param {number} currentHealth
 * @returns {boolean}
 */
const isDead = (currentHealth) => {
    return currentHealth <= 0;
}

/**
 * Check if health is hitted within time
 * 
 * @param {number} time
 * @param {number} lastHit
 * @returns {boolean}
 */
const isHittedWithin = (time, lastHit=null) => {
    return lastHit !== null && Date.now() - lastHit <= time;
}

export {
    applyDamage,
    isDead,
    isHittedWithin
}

/**
 * The health model
 * 
 * @param {object} object3D
 * @param {string} team
 * @param {number} current
 * @param {number} max
 * @param {function} onDie
 * @param {function} onDamage
 * @param {number} healthBarYOffset
 * @returns {HealthModel}
 */
export default (
    object3D, 
    team='player', 
    current=100, 
    max=100, 
    onDie=()=>{}, 
    onDamage=(attacker)=>{},
    healthBarYOffset=0
) => {
    const currentHealth = ref(current)
    const maxHealth = ref(max)
    const lastHit = ref(null)
    const uuid = object3D.uuid
    
    const barModel = BarModel(object3D, healthBarYOffset);
    barModel.setProgress(currentHealth.value, maxHealth.value);

    return {
        applyDamage: (damage, attacker, attackerTeam='other') => {
            const { currentHealth: ch, isDead, time } = applyDamage(
                currentHealth.value, team, damage, attackerTeam);

            currentHealth.value = ch;
            lastHit.value = time;

            if (isDead) {
                onDie();
            } else {
                onDamage(attacker);
            }

            barModel.setProgress(currentHealth.value, maxHealth.value);

            return this;
        },
        isDead: () => {
            return isDead(currentHealth.value);
        },
        isHittedWithin: (time) => {
            return isHittedWithin(time, lastHit.value);
        },
        reset: () => {
            currentHealth.value = maxHealth.value;
            lastHit.value = null;
            barModel.setProgress(currentHealth.value, maxHealth.value);

            return this;
        },
        getCurrentHealth: () => {
            return currentHealth.value;
        },
        getMaxHealth: () => {
            return maxHealth.value;
        },
        isDamaged: () => {
            return currentHealth.value < maxHealth.value;
        },
        team,
        uuid,
        barModel,
        object3D
    }
}
