import Wait from './utils/wait.js';
import Timer from './utils/timer.js';
import Produce from './construction/produce.js';
import TrySpawn from "./construction/try_spawn.js";
import LookForEnemy from "./construction/look_for_enemy.js";
import Attack from "./construction/attack.js";

export default {
    WAIT: Wait,
    TIMER: Timer,
    TRY_SPAWN: TrySpawn,
    PRODUCE: Produce,
    LOOK_FOR_ENEMY: LookForEnemy,
    ATTACK: Attack,
}
