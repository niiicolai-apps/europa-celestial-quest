import { ref, computed } from 'vue'
import GameBank from 'game-bank';
import PersistentData from './persistent_data.js';

const BANK_NAME = 'Player Bank';
const CURRENCIES = { COINS: 'coins', DIAMONDS: 'diamonds' }
const bank = ref(null);
const accounts = computed(() => bank.value.accounts);
const isInitialized = ref(false);

export function useBank() {
    const init = async () => {
        if (isInitialized.value) return;

        GameBank.Currency.createMany(
            { name: CURRENCIES.COINS, options: {} }, 
            { name: CURRENCIES.DIAMONDS, options: {} }
        );

        const pdCoins = await PersistentData.get(CURRENCIES.COINS);
        const pdDiamonds = await PersistentData.get(CURRENCIES.DIAMONDS);
       
        const coins = pdCoins?.balance || 100;
        const diamonds = pdDiamonds?.balance || 10;

        bank.value = GameBank.Bank.create(BANK_NAME, {
            defaultAccounts: [
                { name: CURRENCIES.COINS, balance: coins },
                { name: CURRENCIES.DIAMONDS, balance: diamonds }
            ]
        });
        
        isInitialized.value = true;
    }

    const deposit = (balance, currency) => {
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

    return {
        init,
        deposit,
        withdraw,
        getBalance,
        isInitialized,
        accounts,
        CURRENCIES
    }
}
