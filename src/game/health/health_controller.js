import HealthModel from './health_model.js';
import { ref } from 'vue';

/**
 * The game's health models
 * @type {Array<HealthModel>}
 */
const models = ref([]);

/**
 * Get the health model by object3D
 * 
 * @param {object} object3D
 * @returns {HealthModel}
 */
const getByObject3D = (object3D) => {
    return models.value.find(model => model.uuid === object3D.uuid);
}

/**
 * Create a health model
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
const create = (
    object3D, 
    team='player', 
    current=100, 
    max=100, 
    onDie=()=>{}, 
    onDamage=(attacker)=>{},
    healthBarYOffset=0
) => {
    if (getByObject3D(object3D)) {
        throw new Error('Health model already exists');
    }

    const model = HealthModel(
        object3D, team, current, max, 
        onDie, onDamage, healthBarYOffset);

    models.value.push(model);

    return model;
}

/**
 * Remove the health model
 * 
 * @param {object} object3D
 */
const remove = (object3D) => {
    const index = models.value.findIndex(model => model.uuid === object3D.uuid);
    if (index > -1) {
        models.value.splice(index, 1);
    }
}

/**
 * Apply damage to the health model
 * 
 * @param {object} object3D
 * @param {number} damage
 * @param {object} attacker
 * @param {string} attackerTeam
 */
const applyDamage = (object3D, damage, attacker, attackerTeam='player') => {
    const model = getByObject3D(object3D);
    if (!model) return;

    model.applyDamage(damage, attacker, attackerTeam);
}

/**
 * Check if the health model is dead
 * 
 * @param {object} object3D
 * @returns {boolean}
 */
const isDead = (object3D) => {
    const model = getByObject3D(object3D);
    if (!model) return true;

    return model.isDead();
}

/**
 * Check if the health model is hitted within time
 * 
 * @param {object} object3D
 * @param {number} time
 * @returns {boolean}
 */
const isHittedWithin = (object3D, time) => {
    const model = getByObject3D(object3D);
    if (!model) return false;

    return model.isHittedWithin(time);
}

/**
 * Reset the health model
 * 
 * @param {object} object3D
 */
const reset = (object3D) => {
    const model = getByObject3D(object3D);
    if (!model) return;

    model.reset();
}

/**
 * Find all health models by team
 * 
 * @param {string} team
 * @param {boolean} isDead
 * @returns {Array<HealthModel>}
 */
const findAllByTeam = (team, isDead=false) => {
    return models.value.filter(h => h.team === team && h.isDead() === isDead)
}

/**
 * Find all health models not on team
 * 
 * @param {string} team
 * @param {boolean} isDead
 * @returns {Array<HealthModel>}
 */
const findAllNotOnTeam = (team, isDead=false) => {
    return models.value.filter(h => h.team !== team && h.isDead() === isDead)    
}

/**
 * find all damaged health models by team
 * 
 * @param {string} team
 * @returns {Array<HealthModel>}
 */
const findAllDamagedByTeam = (team) => {
    return models.value.filter(h => h.team === team && h.isDamaged())
}

/**
 * Find the closest health model not on team
 * 
 * @param {string} team
 * @param {object} position
 * @returns {object}
 */
const findClosestNotOnTeam = (team, position) => {
    const models = findAllNotOnTeam(team);
    
    let closest = null;
    let closestDistance = Infinity;

    for (const model of models) {
        const distance = model.object3D.position.distanceTo(position);

        if (distance < closestDistance) {
            closest = model;
            closestDistance = distance;
        }
    }

    return { closest, closestDistance };
}

export default {
    create,
    getByObject3D,
    remove,
    applyDamage,
    isDead,
    isHittedWithin,
    reset,
    findAllByTeam,
    findAllNotOnTeam,
    findAllDamagedByTeam,
    findClosestNotOnTeam
}
