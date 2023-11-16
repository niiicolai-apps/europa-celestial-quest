import { ref } from 'vue'
import GameBank from 'game-bank';

const BANK_NAME = 'Player Bank';
const CURRENCIES = { COINS: 'coins', DIAMONDS: 'diamonds' }
const bank = ref(null);
const isInitialized = ref(false);

export function useBank() {
    const init = () => {
        if (isInitialized.value) return;

        GameBank.Currency.createMany(
            { name: CURRENCIES.COINS, options: {} }, 
            { name: CURRENCIES.DIAMONDS, options: {} }
        );
        
        bank.value = GameBank.Bank.create(BANK_NAME, {
            defaultAccounts: [
                { name: CURRENCIES.COINS, balance: 100 },
                { name: CURRENCIES.DIAMONDS, balance: 10 }
            ]
        });

        isInitialized.value = true;
    }

    return {
        init,
        bank,
        CURRENCIES
    }
}
