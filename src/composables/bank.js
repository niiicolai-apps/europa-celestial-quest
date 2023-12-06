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
}
const bank = ref(null);
const accounts = computed(() => bank.value.accounts);
const isInitialized = ref(false);

export function useBank() {
    const init = async () => {
        if (isInitialized.value) return;

        GameBank.Currency.createMany(
            { name: CURRENCIES.COINS, options: {} }, 
            { name: CURRENCIES.DIAMONDS, options: {} },
            { name: CURRENCIES.ICE, options: { max: 100 } },
            { name: CURRENCIES.ROCK, options: { max: 100 } },
            { name: CURRENCIES.HYRDOGEN, options: { max: 100 } },
            { name: CURRENCIES.METAL, options: { max: 100 } },
        );

        const pdCoins = await PersistentData.get(CURRENCIES.COINS);
        const pdDiamonds = await PersistentData.get(CURRENCIES.DIAMONDS);
        const pdIce = await PersistentData.get(CURRENCIES.ICE);
        const pdRock = await PersistentData.get(CURRENCIES.ROCK);
        const pdHydrogen = await PersistentData.get(CURRENCIES.HYRDOGEN);
        const pdMetal = await PersistentData.get(CURRENCIES.METAL);
       
        const coins = pdCoins?.balance || 100;
        const diamonds = pdDiamonds?.balance || 10;
        const ice = pdIce?.balance || 0;
        const rock = pdRock?.balance || 0;
        const hydrogen = pdHydrogen?.balance || 0;
        const metal = pdMetal?.balance || 0;

        bank.value = GameBank.Bank.create(BANK_NAME, {
            defaultAccounts: [
                { name: CURRENCIES.COINS, balance: coins },
                { name: CURRENCIES.DIAMONDS, balance: diamonds },
                { name: CURRENCIES.ICE, balance: ice },
                { name: CURRENCIES.ROCK, balance: rock },
                { name: CURRENCIES.HYRDOGEN, balance: hydrogen },
                { name: CURRENCIES.METAL, balance: metal },
            ]
        });
        
        isInitialized.value = true;
    }

    const deposit = (balance, currency) => {
        // Enforce max balance
        const c = GameBank.Currency.findByName(currency);
        if (c.max) {
            const b = getBalance(currency);
            const n = b + balance;
            if (n > c.max) return false;
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
        init,
        deposit,
        withdraw,
        getBalance,
        canAfford,
        isInitialized,
        accounts,
        CURRENCIES
    }
}
