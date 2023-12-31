import { ref } from 'vue';
import UnitModel from './unit_model.js';

const units = ref([]);

/**
 * Create a new unit.
 * 
 * @param {object} object3D
 * @param {object} data
 * @param {string} team
 * @returns {object}
 */
const create = (object3D, data, team = 'team-1') => {
    if (findByObject3D(object3D)) throw new Error(`Unit with object3D ${object3D.uuid} already exists`);

    const unit = UnitModel(object3D, data, team);
    units.value.push(unit);
    return unit;
}

/**
 * Remove a unit.
 * 
 * @param {object3D} object3D
 * @returns {void}
 */
const remove = (object3D) => {
    const index = units.value.findIndex(unit => unit.object3D.uuid === object3D.uuid);
    if (index === -1) return;
    units.value.splice(index, 1);
}

/**
 * Find by object3D.
 * 
 * @param {object3D} object3D
 * @returns {object}
 */
const findByObject3D = (object3D) => {
    return units.value.find(unit => unit.object3D.uuid === object3D.uuid);
}

/**
 * find a unit by name.
 * 
 * @param {string} name
 * @returns {object}
 */
const findByName = (name) => {
    return units.value.find(unit => unit.data.name === name);
}

/**
 * find all units by team.
 * 
 * @param {string} team
 * @returns {object[]}
 */
const findAllByTeam = (team) => {
    return units.value.filter(unit => unit.team === team);
}

/**
 * Find all units not on the team.
 * 
 * @param {string} team
 * @returns {object[]}
 */
const findAllNotOnTeam = (team) => {
    return units.value.filter(unit => unit.team !== team);
}

/**
 * Find the closest unit to the position.
 * 
 * @param {object[]} units
 * @param {object} position
 * @returns {object}
 */
const findClosest = (units, position) => {
    let closest = null;
    let closestDistance = null;
    for (const unit of units) {
        const distance = unit.object3D.position.distanceTo(position);
        if (closest === null || distance < closestDistance) {
            closest = unit;
            closestDistance = distance;
        }
    }
    return { unit: closest, closestDistance };
}

/**
 * find closest not on team.
 * 
 * @param {string} team
 * @param {object} position
 * @returns {object}
 */
const findClosestNotOnTeam = (team, position) => {
    const notOnTeam = findAllNotOnTeam(team);
    return findClosest(notOnTeam, position);
}

/**
 * Count by name.
 * 
 * @param {string} name
 * @returns {number}
 */
const countByName = (name) => {
    return units.value.filter(unit => unit.data.name === name).length;
}

/**
 * Count by team.
 * 
 * @param {string} team
 * @returns {number}
 */
const countByTeam = (team) => {
    return units.value.filter(unit => unit.team === team).length;
}

/**
 * Count by name and team.
 * 
 * @param {string} name
 * @param {string} team
 * @returns {number}
 */
const countByNameAndTeam = (name, team) => {
    return units.value.filter(unit => unit.data.name === name && unit.team === team).length;
}

export default {
    units,
    create,
    remove,
    findByObject3D,
    findByName,
    findAllByTeam,
    findAllNotOnTeam,
    findClosestNotOnTeam,
    findClosest,
    countByName,
    countByNameAndTeam,
    countByTeam
}
