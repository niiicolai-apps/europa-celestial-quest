import { ref } from 'vue'
import currencyUtils from './currencies.js';

/**
 * Creates or finds an account for a currency.
 * 
 * @param {string} currency The currency to create or find an account for.
 * @param {Account[]} accounts The accounts to search.
 * @returns {{ account: Account, accounts: Account[] }} The account and the accounts.
 * @throws {Error} If the currency is invalid.
 */
const createOrFindAccount = (currency, accounts = []) => {
    if (!currencyUtils.isValidCurrency(currency))
        throw new Error(`Unknown currency: ${currency}`);

    let account = accounts.find(a => a.currency === currency);

    if (!account) {
        const currencyDetails = currencyUtils.getCurrency(currency);

        account = {
            currency,
            balance: 0,
            max: currencyDetails.defaultMax,
            defaultMax: currencyDetails.defaultMax,
            totalMax: currencyDetails.totalMax
        };

        accounts.push(account);
    }

    return { account, accounts };
}

/**
 * Deposits an amount of a currency into an account.
 * 
 * @param {number} balance The amount to deposit.
 * @param {string} currency The currency to deposit.
 * @param {Account[]} accounts The accounts to search.
 * @returns {boolean} True if the deposit was successful, false otherwise.
 * @throws {Error} If the currency is invalid.
 */
const deposit = (balance, currency, accounts = []) => {
    if (!currencyUtils.isValidCurrency(currency))
        throw new Error(`Unknown currency: ${currency}`);

    const { account } = createOrFindAccount(currency, accounts)
    account.balance += balance;

    if (account.balance > account.max) {
        account.balance = account.max;
    }

    return true
}

/**
 * Withdraws an amount of a currency from an account.
 * 
 * @param {number} balance The amount to withdraw.
 * @param {string} currency The currency to withdraw.
 * @param {Account[]} accounts The accounts to search.
 * @returns {boolean} True if the withdrawal was successful, false otherwise.
 * @throws {Error} If the currency is invalid.
 */
const withdraw = (balance, currency, accounts = []) => {
    if (!currencyUtils.isValidCurrency(currency))
        throw new Error(`Unknown currency: ${currency}`);

    const { account } = createOrFindAccount(currency, accounts)

    if (account.balance < balance)
        return false

    account.balance -= balance;

    return true
}

/**
 * Gets the balance of an account.
 * 
 * @param {string} currency The currency to get the balance for.
 * @param {Account[]} accounts The accounts to search.
 * @returns {number} The balance of the account.
 * @throws {Error} If the currency is invalid.
 */
const getBalance = (currency, accounts = []) => {
    if (!currencyUtils.isValidCurrency(currency))
        throw new Error(`Unknown currency: ${currency}`);

    const { account } = createOrFindAccount(currency, accounts)

    return account.balance;
}

/**
 * Sets the max of an account.
 * 
 * @param {string} currency The currency to set the max for.
 * @param {number} amount The amount to set the max to.
 * @param {Account[]} accounts The accounts to search.
 * @throws {Error} If the currency is invalid.
 */
const setMax = (currency, amount, accounts = []) => {
    if (!currencyUtils.isValidCurrency(currency))
        throw new Error(`Unknown currency: ${currency}`);

    const { account } = createOrFindAccount(currency, accounts)
    const { defaultMax, totalMax } = account;

    account.max = defaultMax + amount;

    /**
     * Ensure max is not greater than total max.
     */
    if (account.max > totalMax) {
        account.max = totalMax;
    } else if (account.max < defaultMax) {
        account.max = defaultMax;
    }

    /**
     * Ensure the balance is not greater than the max.
     */
    if (account.balance > account.max) {
        account.balance = account.max;
    }
}

/**
 * Resets the max of an account to the default max.
 * 
 * @param {string} currency The currency to reset the max for.
 * @param {Account[]} accounts The accounts to search.
 * @throws {Error} If the currency is invalid.
 */
const resetMax = (currency, accounts = []) => {
    if (!currencyUtils.isValidCurrency(currency))
        throw new Error(`Unknown currency: ${currency}`);

    const { account } = createOrFindAccount(currency, accounts)

    account.max = account.defaultMax;

    /**
     * Ensure the balance is not greater than the max.
     */
    if (account.balance > account.max) {
        account.balance = account.max;
    }
}

/**
 * Gets the max of an account.
 * 
 * @param {string} currency The currency to get the max for.
 * @param {Account[]} accounts The accounts to search.
 * @returns {number} The max of the account.
 * @throws {Error} If the currency is invalid.
 */
const getMax = (currency, accounts = []) => {
    if (!currencyUtils.isValidCurrency(currency)) 
        throw new Error(`Unknown currency: ${currency}`);

    const { account } = createOrFindAccount(currency, accounts)

    return account.max;
}

/**
 * Gets the account for a currency.
 * 
 * @param {string} currency The currency to get the account for.
 * @param {Account[]} accounts The accounts to search.
 * @returns {Account} The account.
 * @throws {Error} If the currency is invalid.
 */
const getAccount = (currency, accounts = []) => {
    if (!currencyUtils.isValidCurrency(currency)) 
        throw new Error(`Unknown currency: ${currency}`);

    const { account } = createOrFindAccount(currency, accounts)

    return account;
}

/**
 * Returns true if the player can afford the costs.
 * 
 * @param {Cost[]} costs The costs to check.
 * @param {Account[]} accounts The accounts to search.
 * @returns {boolean} True if the player can afford the costs, false otherwise.
 */
const canAfford = (costs, accounts = []) => {
    for (const cost of costs) {
        if (getBalance(cost.currency, accounts) < cost.amount) {
            return false
        }
    }
    return true
}

/**
 * Adds any missing accounts to the accounts array.
 * 
 * @param {Account[]} accounts The accounts to search.
 */
const addAccountsForMissingCurrencies = (accounts = []) => {
    Object.values(currencyUtils.CURRENCIES).forEach(c => {
        if (!accounts.find(a => a.currency === c.name)) {
            accounts.push({ 
                currency: c.name, 
                balance: c.defaultMax, 
                max: c.defaultMax, 
                defaultMax: c.defaultMax,
                totalMax: c.totalMax
            });
        }
    });
}

export {
    createOrFindAccount,
    deposit,
    withdraw,
    getBalance,
    getAccount,
    setMax,
    getMax,
    resetMax,
    canAfford,
    addAccountsForMissingCurrencies
}

/**
 * The bank model.
 * 
 * @param {String} team The team the bank belongs to.
 * @param {Account[]} startAccounts The accounts to start with.
 * @returns {Bank}
 */
export default (team, startAccounts=[]) => {
    addAccountsForMissingCurrencies(startAccounts);
    const accounts = ref(startAccounts);

    return {
        team,
        accounts,
        deposit: (balance, currency) => deposit(balance, currency, accounts.value),
        withdraw: (balance, currency) => withdraw(balance, currency, accounts.value),
        getBalance: (currency) => getBalance(currency, accounts.value),
        setMax: (currency, amount) => setMax(currency, amount, accounts.value),
        getMax: (currency) => getMax(currency, accounts.value),
        resetMax: (currency) => resetMax(currency, accounts.value),
        canAfford: (costs) => canAfford(costs, accounts.value),
        getAccount: (currency) => getAccount(currency, accounts.value)
    }
}
