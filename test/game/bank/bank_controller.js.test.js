import { expect, test } from 'vitest'
import BankController from '../../../src/game/bank/bank_controller.js'

test('create should create a bank for the given team', () => {
    const bank = BankController.create('red');

    expect(bank).toBeDefined();
    expect(bank.team).toBe('red');
})

test('adding start accounts to create should add pre-existing accounts', () => {
    const bank = BankController.create('red', [
        { currency: 'ice', balance: 10, max: 300, defaultMax: 1000, totalMax: 2000 }
    ]);
    const account = bank.getAccount('ice');
    expect(bank).toBeDefined();
    expect(account).toBeDefined();
    expect(account.currency).toBe('ice');
    expect(account.balance).toBe(10);
    expect(account.max).toBe(300);
    expect(account.defaultMax).toBe(1000);
})

test('creating an account should add it to the bank list', () => {
    const bank = BankController.create('a team no one has ever heard of');
    const banks = BankController.banks.value;

    expect(banks).toBeDefined();
    expect(banks.length > 0).toBe(true);
    expect(banks[banks.length - 1].team).toBe(bank.team);
})

test('get should return the bank for the given team', () => {
    const bank = BankController.create('a team no one has ever heard of 2');
    const found = BankController.get('a team no one has ever heard of 2');

    expect(found.team).toBe(bank.team);
})

test ('remove should remove the bank for the given team', () => {
    const bank = BankController.create('a team no one has ever heard of 3');
    expect(BankController.get(bank.team)).toBeDefined();

    BankController.remove(bank.team);
    expect(BankController.get(bank.team)).toBe(undefined); 
})