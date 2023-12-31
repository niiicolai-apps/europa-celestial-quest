import { useBillboard } from "../billboard/billboard.js";
import HealthController from './health_controller.js';

/**
 * The health interface
 */
export const useHealth = () => {

    /**
     * Add a health object
     * 
     * @param {object} object3D
     * @param {string} team
     * @param {number} current
     * @param {number} max
     * @param {function} onDie
     * @param {function} onDamage
     * @param {number} _healthBarYOffset
     * @returns {HealthModel}
     * @throws {Error} if the health model already exists
     */
    const addHealthObject = (
        object3D, team='player', current=100, max=100, 
        onDie=()=>{}, onDamage=(attacker)=>{}, _healthBarYOffset=0
        ) => {
        const hc = HealthController.create(
            object3D, team, current, max,
            onDie, onDamage, _healthBarYOffset
        );
        useBillboard().add(hc.barModel.bggMesh);
    }

    /**
     * Remove the health object
     * 
     * @param {object} object3D
     * @returns {HealthModel}
     */
    const removeHealthObject = (object3D) => {
        const model = HealthController.getByObject3D(object3D);
        if (model) {
            HealthController.remove(object3D);
            useBillboard().remove(model.barModel.bggMesh);
        }
    }

    /**
     * Apply damage to the health object
     * 
     * @param {object} object3D
     * @param {number} damage
     * @param {object} attacker
     * @param {string} attackerTeam
     * @returns {HealthModel}
     */
    const applyDamage = (object3D, damage, attacker, attackerTeam='player') => {
        HealthController.applyDamage(object3D, damage, attacker, attackerTeam);
    }

    /**
     * Check if the health object is dead
     * 
     * @param {object} object3D
     * @returns {boolean}
     */
    const isDead = (object3D) => {
        return HealthController.isDead(object3D);
    }

    /**
     * Reset the health object
     * 
     * @param {object} object3D
     */
    const reset = (object3D) => {
        HealthController.reset(object3D);
    }

    /**
     * check if the health object is hitted within time
     * 
     * @param {object} object3D
     * @param {number} time
     * @returns {boolean}
     */
    const isHittedWithin = (object3D, time) => {
        return HealthController.isHittedWithin(object3D, time);        
    }

    /**
     * find the health object by object3D
     * 
     * @param {object} object3D
     * @returns {HealthModel}
     */
    const findByObject3D = (object3D) => {
        return HealthController.getByObject3D(object3D);
    }

    /**
     * find all health objects by team
     * 
     * @param {string} team
     * @param {boolean} isDead
     * @returns {Array<HealthModel>}
     */
    const findAllByTeam = (team, isDead=false) => {
        return HealthController.findAllByTeam(team, isDead);        
    }

    /**
     * find all damaged health objects by team
     * 
     * @param {string} team
     * @returns {Array<HealthModel>}
     */
    const findAllDamagedByTeam = (team) => {
        return HealthController.findAllDamagedByTeam(team);
    }

    /**
     * find all health objects not on team
     * 
     * @param {string} team
     * @param {boolean} isDead
     * @returns {Array<HealthModel>}
     */
    const findAllNotOnTeam = (team, isDead=false) => {
        return HealthController.findAllNotOnTeam(team, isDead);        
    }

    /**
     * find the closest health object not on team
     * 
     * @param {string} team
     * @param {object} position
     * @returns {HealthModel}
     */
    const findClosestNotOnTeam = (team, position) => {
        return HealthController.findClosestNotOnTeam(team, position);
    }

    return {
        addHealthObject,
        removeHealthObject,
        applyDamage,
        isDead,
        reset,
        findByObject3D,
        findAllByTeam,
        findAllNotOnTeam,
        findAllDamagedByTeam,
        findClosestNotOnTeam,
        isHittedWithin
    }
}
