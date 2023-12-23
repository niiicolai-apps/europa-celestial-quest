import { ref } from 'vue';
import BankModel from './bank_model.js';

const banks = ref([]);

/**
 * Create a new bank for the given team.
 * 
 * @param {String} team 
 * @param {Account[]} startAccounts
 * @returns 
 */
const create = (team, startAccounts=[]) => {
    const bank = BankModel(team, startAccounts);
    banks.value.push(bank);
    return bank;
}

/**
 * Get the bank for the given team.
 * 
 * @param {String} team
 * @returns {Bank}
 */
const get = (team) => {
    return banks.value.find(b => b.team === team);
}

/**
 * Remove the bank for the given team.
 * 
 * @param {String} team
 * @returns {Boolean} True if the bank was removed, false otherwise.
 */
const remove = (team) => {
    const bank = get(team);
    if (!bank) return false;

    const index = banks.value.indexOf(bank);
    banks.value.splice(index, 1);

    return true;
}

export default {
    banks,
    create,
    get,
    remove
}
