import { ref, computed } from 'vue'
import GameBank from 'game-bank';
import PersistentData from './persistent_data.js';

const BANK_NAME = 'Player Bank';
const CURRENCIES = { 
    COINS: 'coins', 
    DIAMONDS: 'diamonds',
    ICE: 'ice',
    ROCK: 'rock',
    HYRDOGEN: 'hydrogen',
    METAL: 'metal',
    POWER: 'power',
    RESEARCH: 'research',
}
const bank = ref(null);
const accounts = computed(() => bank.value.accounts);
const isInitialized = ref(false);

export function useBank() {
    const init = async () => {
        if (isInitialized.value) return;

        GameBank.Currency.createMany(
            { name: CURRENCIES.ICE, options: { max: 100, defaultMax: 100 } },
            { name: CURRENCIES.ROCK, options: { max: 100, defaultMax: 100 } },
            { name: CURRENCIES.HYRDOGEN, options: { max: 100, defaultMax: 100 } },
            { name: CURRENCIES.METAL, options: { max: 100, defaultMax: 100 } },
            { name: CURRENCIES.POWER, options: { max: 100, defaultMax: 100 } },
            { name: CURRENCIES.RESEARCH, options: { max: 100, defaultMax: 100 } }
        );

        const pdIce = await PersistentData.get(CURRENCIES.ICE);
        const pdRock = await PersistentData.get(CURRENCIES.ROCK);
        const pdHydrogen = await PersistentData.get(CURRENCIES.HYRDOGEN);
        const pdMetal = await PersistentData.get(CURRENCIES.METAL);
        const pdPower = await PersistentData.get(CURRENCIES.POWER);
        const pdResearch = await PersistentData.get(CURRENCIES.RESEARCH);

        const ice = pdIce?.balance || 100;
        const rock = pdRock?.balance || 100;
        const hydrogen = pdHydrogen?.balance || 50;
        const metal = pdMetal?.balance || 50;
        const power = pdPower?.balance || 100;
        const research = pdResearch?.balance || 0;

        bank.value = GameBank.Bank.create(BANK_NAME, {
            defaultAccounts: [
                { name: CURRENCIES.ICE, balance: ice },
                { name: CURRENCIES.ROCK, balance: rock },
                { name: CURRENCIES.HYRDOGEN, balance: hydrogen },
                { name: CURRENCIES.METAL, balance: metal },
                { name: CURRENCIES.POWER, balance: power },
                { name: CURRENCIES.RESEARCH, balance: research }
            ]
        });
        
        isInitialized.value = true;
    }

    const updateCurrencyMax = (currency, max) => {
        if (!isInitialized.value) throw new Error('Bank not initialized');
        const acc = bank.value.accounts;
        const account = acc.find(a => a.name === currency);
        if (!account) return;
        const index = acc.indexOf(account);
        acc[index].max = max + acc[index].defaultMax;
        bank.value.accounts = acc;
    }

    const getCurrency = (currency) => {
        if (!isInitialized.value) throw new Error('Bank not initialized');
        const acc = bank.value.accounts;
        const account = acc.find(a => a.name === currency);
        if (!account) return null;
        return account;
    }

    const overrideBalance = (balance, currency) => {
        if (!isInitialized.value) throw new Error('Bank not initialized');
        const acc = bank.value.accounts;
        const account = acc.find(a => a.name === currency);
        if (!account) return;
        const index = acc.indexOf(account);
        acc[index].balance = balance;
        bank.value.accounts = acc;
    }

    const deposit = (balance, currency) => {
        // Enforce max balance
        const acc = bank.value.accounts;
        const account = acc.find(a => a.name === currency);
        if (!account) throw new Error(`Unknown currency: ${currency}`);
        
        if (account.max) {
            const b = getBalance(currency);
            const n = b + balance;
            if (n > account.max) {
                balance = account.max - b; 
            }
        }

        bank.value.deposit(balance, currency);
        PersistentData.set(currency, { balance: getBalance(currency) });
    }

    const withdraw = (balance, currency) => {
        if (bank.value.withdraw(balance, currency))
            PersistentData.set(currency, { balance: getBalance(currency) });
    }

    const getBalance = (currency) => {
        for (const account of accounts.value) {
            if (account.name === currency) return account.balance;
        }
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
        bank,
        init,
        deposit,
        withdraw,
        getBalance,
        canAfford,
        isInitialized,
        accounts,
        updateCurrencyMax,
        getCurrency,
        overrideBalance,
        CURRENCIES
    }
}
