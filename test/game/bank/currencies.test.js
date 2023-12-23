import { expect, test } from 'vitest'
import utils from '../../../src/game/bank/currencies.js'

test('all currencies should have a name and defaultMax', () => {
    const currencies = utils.CURRENCIES;

    for (const c of Object.values(currencies)) {
        expect(c.name).toBeDefined();
        expect(c.defaultMax).toBeDefined();
        expect(c.totalMax).toBeDefined();
    }
})

test('isValidCurrency should return true for valid currencies', () => {
    const currencies = utils.CURRENCIES;

    for (const c of Object.values(currencies)) {
        expect(utils.isValidCurrency(c.name)).toBe(true);
    }
})

test('isValidCurrency should return false for invalid currencies', () => {
    expect(utils.isValidCurrency('unknown')).toBe(false);
})

test('getCurrency should return the currency for valid currencies', () => {
    const currencies = utils.CURRENCIES;

    for (const c of Object.values(currencies)) {
        expect(utils.getCurrency(c.name)).toBe(c);
    }
})

test('getCurrency should return null for invalid currencies', () => {
    expect(utils.getCurrency('unknown')).toBe(null);
})