import { ref } from 'vue'
import { useManager } from '../managers/manager.js';
import { usePlayers } from '../players/player.js';
import PersistentData from '../persistent_data/persistent_data.js';

const banks = ref([])

const CURRENCIES = { 
    ICE: {
        name: 'ice',
        defaultMax: 100
    },
    ROCK: {
        name: 'rock',
        defaultMax: 100
    },
    HYRDOGEN: {
        name: 'hydrogen',
        defaultMax: 100
    },
    METAL: {
        name: 'metal',
        defaultMax: 100
    },
    POWER: {
        name: 'power',
        defaultMax: 100
    },
    RESEARCH: {
        name: 'research',
        defaultMax: 100
    }
}

const isValidCurrency = (currency) => {
    for (const c of Object.values(CURRENCIES)) {
        if (c.name.toLowerCase() === currency.toLowerCase()) return true;
    }
    return false;
}

const getCurrency = (currency) => {
    for (const c of Object.values(CURRENCIES)) {
        if (c.name.toLowerCase() === currency.toLowerCase()) return c;
    }
    return null;
}

const Bank = (team, startAccounts=[]) => {
    const accounts = ref(startAccounts);
    Object.values(CURRENCIES).forEach(c => {
        if (!accounts.value.find(a => a.currency === c.name)) {
            accounts.value.push({ 
                currency: c.name, 
                balance: c.defaultMax, 
                max: c.defaultMax, 
                defaultMax: c.defaultMax
            });
        }
    });

    const createOrFindAccount = (currency) => {
        let account = accounts.value.find(a => a.currency === currency);
        if (!account) {
            const currencyDetails = getCurrency(currency);
            account = { 
                currency, 
                balance: 0, 
                max: currencyDetails.defaultMax, 
                defaultMax: currencyDetails.defaultMax 
            };
            accounts.value.push(account);
        }
        return account;
    }

    const deposit = (balance, currency) => {
        if (!isValidCurrency(currency)) throw new Error(`Unknown currency: ${currency}`);

        const account = createOrFindAccount(currency)
        account.balance += balance;
        if (account.balance > account.max) {
            account.balance = account.max;
        }
        return true;
    }

    const withdraw = (balance, currency) => {
        if (!isValidCurrency(currency)) throw new Error(`Unknown currency: ${currency}`);

        const account = createOrFindAccount(currency)
        if (account.balance < balance) return false;
        account.balance -= balance;

        return true;
    }

    const getBalance = (currency) => {
        if (!isValidCurrency(currency)) throw new Error(`Unknown currency: ${currency}`);

        const account = createOrFindAccount(currency)
        return account.balance;
    }

    const setMax = (currency, amount) => {
        if (!isValidCurrency(currency)) throw new Error(`Unknown currency: ${currency}`);

        const account = createOrFindAccount(currency)
        account.max = account.defaultMax + amount;
        
        if (account.balance > account.max) {
            account.balance = account.max;
        }
    }

    const resetMax = (currency) => {
        if (!isValidCurrency(currency)) throw new Error(`Unknown currency: ${currency}`);

        const account = createOrFindAccount(currency)
        account.max = account.defaultMax;

        if (account.balance > account.max) {
            account.balance = account.max;
        }
    }

    const getMax = (currency) => {
        if (!isValidCurrency(currency)) throw new Error(`Unknown currency: ${currency}`);

        const account = createOrFindAccount(currency)
        return account.max;
    }

    const canAfford = (costs) => {
        let canAfford = true
        for (const cost of costs) {
            if (getBalance(cost.currency) < cost.amount) {
                canAfford = false
                break
            }
        }
        return canAfford
    }

    return {
        team,
        accounts,
        deposit,
        withdraw,
        getBalance,
        setMax,
        getMax,
        resetMax,
        canAfford
    }
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('bank', {
})

export function useBank() {

    const create = (team, startAccounts=[]) => {
        const bank = Bank(team, startAccounts);
        banks.value.push(bank);
        return bank;
    }

    const get = (team) => {
        return banks.value.find(b => b.team === team);
    }

    const remove = (team) => {
        const bank = get(team);
        if (!bank) return false;
        const index = banks.value.indexOf(bank);
        banks.value.splice(index, 1);
        return true;
    }

    const findAll = () => {
        return banks.value;
    }

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
