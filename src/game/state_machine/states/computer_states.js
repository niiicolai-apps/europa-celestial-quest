import Wait from './utils/wait.js';
import Timer from './utils/timer.js';
import SpawnArmy from './computer/spawn_army.js';
import AttackCheck from './computer/attack_check.js';
import DamageCheck from './computer/damage_check.js';
import ArmyCheck from './computer/army_check.js';

export default {
    WAIT: Wait,
    TIMER: Timer,
    SPAWN_ARMY: SpawnArmy,
    ATTACK_CHECK: AttackCheck,
    DAMAGE_CHECK: DamageCheck,
    ARMY_CHECK: ArmyCheck,
}