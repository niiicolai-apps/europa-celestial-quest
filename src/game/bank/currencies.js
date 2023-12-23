/**
 * The game's currencies.
 * 
 * @typedef {Object} Currency
 * @property {string} name The name of the currency.
 * @property {number} defaultMax The default maximum amount of the currency.
 */
const CURRENCIES = {
    ICE: {
        name: 'ice',
        defaultMax: 100,
        totalMax: 1000
    },
    ROCK: {
        name: 'rock',
        defaultMax: 100,
        totalMax: 1000
    },
    HYRDOGEN: {
        name: 'hydrogen',
        defaultMax: 100,
        totalMax: 1000
    },
    METAL: {
        name: 'metal',
        defaultMax: 100,
        totalMax: 1000
    },
    POWER: {
        name: 'power',
        defaultMax: 100,
        totalMax: 1000
    },
    RESEARCH: {
        name: 'research',
        defaultMax: 100,
        totalMax: 1000
    }
}

/**
 * Checks if a currency is valid.
 * 
 * @param {string} currency The currency to check.
 * @returns {boolean} True if the currency is valid, false otherwise.
 */
const isValidCurrency = (currency) => {
    for (const c of Object.values(CURRENCIES)) {
        if (c.name.toLowerCase() === currency.toLowerCase()) return true;
    }
    return false;
}

/**
 * Gets the currency object for a currency.
 * 
 * @param {string} currency The currency to get.
 * @returns {Currency} The currency object, or null if the currency is invalid.
 */
const getCurrency = (currency) => {
    for (const c of Object.values(CURRENCIES)) {
        if (c.name.toLowerCase() === currency.toLowerCase()) return c;
    }
    return null;
}

export default {
    CURRENCIES,
    isValidCurrency,
    getCurrency
}
