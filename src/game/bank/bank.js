import { useManager } from '../managers/manager.js';
import { usePlayers } from '../players/player.js';
import BankManager from './bank_controller.js'

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('bank', {
})

/**
 * Bank interface.
 * 
 * @typedef {Object} Bank Interface for the bank.
 */
export function useBank() {

    /**
     * Create a new bank for the given team.
     * 
     * @param {String} team The team the bank belongs to.
     * @param {Account[]} startAccounts The accounts to start with.
     * @returns {Bank}
     * @public
     */
    const create = (team, startAccounts=[]) => {
        return BankManager.create(team, startAccounts);
    }

    /**
     * Get the bank for the given team.
     * 
     * @param {String} team The team the bank belongs to.
     * @returns {Bank}
     * @public
     */
    const get = (team) => {
        return BankManager.get(team);
    }

    /**
     * Remove the bank for the given team.
     * 
     * @param {String} team The team the bank belongs to.
     * @returns {void}
     * @public
     */
    const remove = (team) => {
        return BankManager.remove(team);
    }

    /**
     * Get all banks.
     * 
     * @returns {Bank[]}
     * @public
     */
    const findAll = () => {
        return BankManager.banks.value;
    }

    /**
     * Get the bank for the current player.
     * 
     * @returns {Bank}
     * @public
     */
    const findYou = () => {
        const players = usePlayers();
        const you = players.findYou();
        if (!you) return null;
        return get(you.team);
    }

    return {
        create,
        get,
        remove,
        findAll,
        findYou,
    }
}
