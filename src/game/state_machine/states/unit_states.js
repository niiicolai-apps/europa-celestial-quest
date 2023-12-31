
import Wait from './utils/wait.js';
import Timer from './utils/timer.js';
import SetState from './utils/set_state.js';
import MoveTo from './unit/move_to.js';
import Collect from './unit/collect.js';
import Deliver from './unit/deliver.js';
import FindClosest from './unit/find_closest.js';
import FindRandom from './unit/find_random.js';
import Regroup from "./unit/regroup.js";
import DefendPosition from "./unit/defend_position.js";
import MoveToAttack from "./unit/move_to_attack.js";
import Attack from "./unit/attack.js";

export default {
    TIMER: Timer,
    MOVE_TO: MoveTo,
    SET_STATE: SetState,
    FIND_CLOSEST: FindClosest,
    FIND_RANDOM: FindRandom,
    COLLECT: Collect,
    DELIVER: Deliver,
    WAIT: Wait,
    REGROUP: Regroup,
    DEFEND_POSITION: DefendPosition,
    ATTACK: Attack,
    MOVE_TO_ATTACK: MoveToAttack,
}
