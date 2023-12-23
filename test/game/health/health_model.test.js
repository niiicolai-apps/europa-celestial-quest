import { expect, test } from 'vitest'
import {
    applyDamage,
    isDead,
    isHittedWithin
} from '../../../src/game/health/health_model.js'

test('applyDamage should return the current health and the time of the hit', () => {
    const { currentHealth, time } = applyDamage(100, 'player', 10, 'other');

    expect(currentHealth).toBe(90);
    expect(time).toBeDefined();
})

test('applyDamage should return the current health always greater than or equal to 0', () => {
    const { currentHealth } = applyDamage(0, 'player', 10, 'other');

    expect(currentHealth).toBe(0);
})

test('isDead should return true if the current health is less than or equal to 0', () => {
    expect(isDead(0)).toBe(true);
    expect(isDead(-1)).toBe(true);
    expect(isDead(1)).toBe(false);
})

test('isHittedWithin should return true if the last hit is within the time', () => {
    expect(isHittedWithin(1000, Date.now())).toBe(true);
    expect(isHittedWithin(1000, Date.now() - 1001)).toBe(false);
})
