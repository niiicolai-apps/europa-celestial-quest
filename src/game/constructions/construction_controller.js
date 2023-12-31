import { ref } from 'vue'
import ConstructionModel from './construction_model.js'

/**
 * Active constructions.
 * 
 * @type {object[]}
 */
const constructions = ref([])

/**
 * Create a new construction.
 * 
 * @param {object} object3D
 * @param {object} definition
 * @param {string} team
 * @returns {object}
 */
const create = (object3D, definition, team = 'team-1', isOwned = false, upgradeIndex = 0) => {
    if (findByObject3D(object3D)) throw new Error(`Construction with object3D ${object3D.uuid} already exists`)

    const construction = ConstructionModel(object3D, definition, team, isOwned, upgradeIndex)
    constructions.value.push(construction)
    return construction
}

/**
 * Remove a construction.
 * 
 * @param {object3D} object3D
 * @returns {void}
 */
const remove = (object3D) => {
    const index = constructions.value.findIndex(construction => construction.object3D.uuid === object3D.uuid)
    if (index === -1) return
    constructions.value.splice(index, 1)
}

/**
 * Find by object3D.
 * 
 * @param {object3D} object3D
 * @returns {object}
 */
const findByObject3D = (object3D) => {
    return constructions.value.find(construction => construction.object3D.uuid === object3D.uuid)
}

/**
 * Find by name.
 * 
 * @param {string} name
 * @returns {object}
 */
const findByName = (name) => {
    return constructions.value.find(construction => construction.definition.name === name)
}

/**
 * Find by name, upgrade, and team.
 * 
 * @param {string} name
 * @param {number} upgradeIndex
 * @param {string} team
 * @returns {object}
 */
const findByNameAndUpgradeAndTeam = (name, upgradeIndex, team) => {
    return constructions.value.find(construction => construction.definition.name === name && construction.upgradeIndex === upgradeIndex && construction.team === team)
}

/**
 * Find by name and team.
 * 
 * @param {string} name
 * @param {string} team
 * @returns {object}
 */
const findByNameAndTeam = (name, team) => {
    return constructions.value.find(construction => construction.definition.name === name && construction.team === team)
}

/**
 * find all constructions by name.
 * 
 * @param {string} name
 * @returns {object[]}
 */
const findAllByName = (name) => {
    return constructions.value.filter(construction => construction.definition.name === name)
}

/**
 * Find all by team.
 * 
 * @param {string} team
 * @returns {object[]}
 */
const findAllByTeam = (team) => {
    return constructions.value.filter(construction => construction.team === team)
}

/**
 * Find all not on team.
 * 
 * @param {string} team
 * @returns {object[]}
 */
const findAllNotOnTeam = (team) => {
    return constructions.value.filter(construction => construction.team !== team)
}

/**
 * find all constructions by name and team.
 * 
 * @param {string} name
 * @param {string} team
 * @returns {object[]}
 */
const findAllByNameAndTeam = (name, team) => {
    return constructions.value.filter(construction => construction.definition.name === name && construction.team === team)
}

/**
 * find closest construction.
 * 
 * @param {object[]} constructions
 * @param {object} position
 */
const findClosest = (constructions, position) => {
    let closestDistance = Infinity
    let closestConstruction = null
    constructions.forEach(construction => {
        const distance = construction.object3D.position.distanceTo(position)
        if (distance < closestDistance) {
            closestDistance = distance
            closestConstruction = construction
        }
    })
    return { closestDistance, construction: closestConstruction }
}

/**
 * Find closest construction by position and name.
 * 
 * @param {object} position
 * @param {string} name
 * @returns {object}
 */
const findClosestByName = (position, name) => {
    const constructions = findAllByName(name)
    return findClosest(constructions, position)
}

/**
 * find closest by name and team.
 * 
 * @param {object} position
 * @param {string} name
 * @param {string} team
 * @returns {object}
 */
const findClosestByNameAndTeam = (position, name, team) => {
    const constructions = findAllByNameAndTeam(name, team)
    return findClosest(constructions, position)
}

/**
 * find closest by team.
 * 
 * @param {object} position
 * @param {string} team
 * @returns {object}
 */
const findClosestByTeam = (position, team) => {
    const constructions = findAllByTeam(team)
    return findClosest(constructions, position)
}

/**
 * find closest not on team.
 * 
 * @param {object} position
 * @param {string} team
 * @returns {object}
 */
const findClosestNotOnTeam = (position, team) => {
    const constructions = findAllNotOnTeam(team)
    return findClosest(constructions, position)
}

/**
 * count by name.
 * 
 * @param {string} name
 * @returns {number}
 */
const countByName = (name) => {
    return constructions.value.filter(construction => construction.definition.name === name).length
}

/**
 * count by team.
 * 
 * @param {string} team
 * @returns {number}
 */
const countByTeam = (team) => {
    return constructions.value.filter(construction => construction.team === team).length
}

/**
 * count by name and team.
 * 
 * @param {string} name
 * @param {string} team
 * @returns {number}
 */
const countByNameAndTeam = (name, team) => {
    return constructions.value.filter(construction => construction.definition.name === name && construction.team === team).length
}

/**
 * count by name and upgrade and team.
 * 
 * @param {string} name
 * @param {number} upgradeIndex
 * @param {string} team
 * @returns {number}
 */
const countByNameAndUpgradeAndTeam = (name, upgradeIndex, team) => {
    return constructions.value.filter(construction => construction.definition.name === name && construction.upgradeIndex === upgradeIndex && construction.team === team).length
}

export default {
    constructions,
    create,
    remove,
    findByObject3D,
    findByName,
    findByNameAndTeam,
    findByNameAndUpgradeAndTeam,
    findAllByName,
    findAllByTeam,
    findAllNotOnTeam,
    findAllByNameAndTeam,
    findClosest,
    findClosestByName,
    findClosestByNameAndTeam,
    findClosestByTeam,
    findClosestNotOnTeam,
    countByName,
    countByNameAndTeam,
    countByTeam,
    countByNameAndUpgradeAndTeam
}
