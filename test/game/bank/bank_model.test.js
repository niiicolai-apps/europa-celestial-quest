
import { expect, test } from 'vitest'
import {
    createOrFindAccount,
    deposit,
    withdraw,
    getBalance,
    setMax,
    getMax,
    resetMax,
    canAfford,
    addAccountsForMissingCurrencies,
    getAccount
} from '../../../src/game/bank/bank_model.js'

test('createOrFindAccount should create an account if it does not exist', () => {
    const { account, accounts } = createOrFindAccount('ice', []);

    expect(account).toBeDefined();
    expect(account.currency).toBe('ice');
    expect(account.balance).toBe(0);
    expect(account.max).toBe(100);
    expect(account.defaultMax).toBe(100);

    expect(accounts).toBeDefined();
    expect(accounts.length).toBe(1);
    expect(accounts[0]).toBe(account);
})

test('createOrFindAccount should find an account if it exists', () => {
    const { account, accounts } = createOrFindAccount('ice', [
        { currency: 'ice', balance: 10, max: 100, defaultMax: 100 }
    ]);

    expect(account).toBeDefined();
    expect(account.currency).toBe('ice');
    expect(account.balance).toBe(10);
    expect(account.max).toBe(100);
    expect(account.defaultMax).toBe(100);

    expect(accounts).toBeDefined();
    expect(accounts.length).toBe(1);
    expect(accounts[0]).toBe(account);
})

test('createOrFindAccount should throw an error if the currency is invalid', () => {
    expect(() => createOrFindAccount('unknown', [])).toThrow();
})

test('deposit should throw an error if the currency is invalid', () => {
    expect(() => deposit(10, 'unknown', [])).toThrow();
})

test('deposit should deposit the balance into the account', () => {
    const accounts = [
        { currency: 'ice', balance: 0, max: 100, defaultMax: 100, totalMax: 1000 }
    ];

    deposit(10, 'ice', accounts);

    expect(accounts[0].balance).toBe(10);
})

test('deposit should not deposit more than the max', () => {
    const accounts = [
        { currency: 'ice', balance: 0, max: 100, defaultMax: 100, totalMax: 1000 }
    ];

    deposit(200, 'ice', accounts);

    expect(accounts[0].balance).toBe(100);
})

test('deposit should return true if the deposit was successful', () => {
    const accounts = [
        { currency: 'ice', balance: 0, max: 100, defaultMax: 100, totalMax: 1000 }
    ];

    expect(deposit(10, 'ice', accounts)).toBe(true);
})

test('withdraw should throw an error if the currency is invalid', () => {
    expect(() => withdraw(10, 'unknown', [])).toThrow();
})

test('withdraw should return false if the account does not have enough balance', () => {
    const accounts = [
        { currency: 'ice', balance: 0, max: 100, defaultMax: 100, totalMax: 1000 }
    ];

    expect(withdraw(10, 'ice', accounts)).toBe(false);
})

test('withdraw should withdraw the balance from the account', () => {
    const accounts = [
        { currency: 'ice', balance: 10, max: 100, defaultMax: 100, totalMax: 1000 }
    ];

    withdraw(10, 'ice', accounts);

    expect(accounts[0].balance).toBe(0);
})

test('withdraw should return true if the withdrawal was successful', () => {
    const accounts = [
        { currency: 'ice', balance: 10, max: 100, defaultMax: 100, totalMax: 1000 }
    ];

    expect(withdraw(10, 'ice', accounts)).toBe(true);
})

test('getBalance should throw an error if the currency is invalid', () => {
    expect(() => getBalance('unknown', [])).toThrow();
})

test('getBalance should return the balance of the account', () => {
    const accounts = [
        { currency: 'ice', balance: 10, max: 100, defaultMax: 100, totalMax: 1000 }
    ];

    expect(getBalance('ice', accounts)).toBe(10);
})

test('setMax should throw an error if the currency is invalid', () => {
    expect(() => setMax('unknown', 10, [])).toThrow();
})

test('setMax should set the max of the account', () => {
    const accounts = [
        { currency: 'ice', balance: 10, max: 100, defaultMax: 100, totalMax: 1000 }
    ];

    setMax('ice', 10, accounts);

    expect(accounts[0].max).toBe(110);
})

test('setMax should not set the max below the defaultMax', () => {
    const accounts = [
        { currency: 'ice', balance: 10, max: 100, defaultMax: 100, totalMax: 1000 }
    ];

    setMax('ice', -200, accounts);

    expect(accounts[0].max).toBe(100);
})

test('setMax should not set the max above the totalMax', () => {
    const accounts = [
        { currency: 'ice', balance: 10, max: 100, defaultMax: 100, totalMax: 1000 }
    ];

    setMax('ice', 2000, accounts);

    expect(accounts[0].max).toBe(1000);
})

test('setMax should set the balance to the max if it is above the max', () => {
    const accounts = [
        { currency: 'ice', balance: 200, max: 200, defaultMax: 100, totalMax: 1000 }
    ];

    setMax('ice', 10, accounts);

    expect(accounts[0].balance).toBe(110);
})

test('getMax should throw an error if the currency is invalid', () => {
    expect(() => getMax('unknown', [])).toThrow();
})

test('getMax should return the max of the account', () => {
    const accounts = [
        { currency: 'ice', balance: 200, max: 200, defaultMax: 100, totalMax: 1000 }
    ];

    expect(getMax('ice', accounts)).toBe(200);
})

test('resetMax should throw an error if the currency is invalid', () => {
    expect(() => resetMax('unknown', [])).toThrow();
})

test('resetMax should reset the max of the account to the defaultMax', () => {
    const accounts = [
        { currency: 'ice', balance: 200, max: 200, defaultMax: 100, totalMax: 1000 }
    ];

    resetMax('ice', accounts);

    expect(accounts[0].max).toBe(100);
})

test('canAfford should return true if the player can afford the costs', () => {
    const accounts = [
        { currency: 'ice', balance: 200, max: 200, defaultMax: 100, totalMax: 1000 }
    ];

    expect(canAfford([{ currency: 'ice', amount: 100 }], accounts)).toBe(true);
})

test('canAfford should return false if the player cannot afford the costs', () => {
    const accounts = [
        { currency: 'ice', balance: 200, max: 200, defaultMax: 100, totalMax: 1000 }
    ];

    expect(canAfford([{ currency: 'ice', amount: 300 }], accounts)).toBe(false);
})

test('getAccount should throw an error if the currency is invalid', () => {
    expect(() => getAccount('unknown', [])).toThrow();
})

test('getAccount should return the account', () => {
    const accounts = [
        { currency: 'ice', balance: 200, max: 200, defaultMax: 100, totalMax: 1000 },
        { currency: 'fire', balance: 200, max: 200, defaultMax: 100, totalMax: 1000 }
    ];

    expect(getAccount('ice', accounts)).toBe(accounts[0]);
})

test('addAccountsForMissingCurrencies should add accounts for missing currencies', () => {
    const accounts = [
        { currency: 'ice', balance: 200, max: 200, defaultMax: 100, totalMax: 1000 },
    ];

    addAccountsForMissingCurrencies(accounts);

    expect(accounts.length > 1).toBe(true);
    expect(accounts[1].currency).not.toBe('ice');
})