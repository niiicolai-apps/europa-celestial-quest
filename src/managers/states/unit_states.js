import { useResources } from "../../managers/resources.js";
import { useNavigation } from "../../managers/navigation.js";
import { useUnits } from "../../managers/units.js";
import { useBank } from "../../managers/bank.js";
import { useItems } from "../../managers/constructions.js";
import { useParticles } from "../particles.js";
import { useHealth } from "../../composables/health.js";
import { useHeightMap } from "../../composables/height_map.js";
import { usePlayers } from "../../managers/player.js";
import { useCommands } from "../../managers/commands.js";
import * as THREE from 'three';

class Base {
    constructor(manager, options={}) {
        this.manager = manager;
        this.options = options;
        if (!manager) throw new Error('Manager is required');
    }

    enter() { }
    update() { }
    exit() { }

    isComplete() {
        return false;
    }
}

class Wait extends Base {
    constructor(manager, options={}) {
        super(manager, options);
    }

    exit() {
    }

    isComplete() {
        return false
    }
}

class Timer extends Base {
    constructor(manager, options={}) {
        super(manager, options);

        const duration = manager.target || 1000;
        this.endTime = Date.now() + duration;
    }

    isComplete() {
        return Date.now() > this.endTime;
    }
}

class MoveTo extends Base {
    constructor(manager, options={}, acceptableDistance=1) {
        super(manager, options);
        this.navigation = useNavigation();
        this.acceptableDistance = acceptableDistance;

        const unit = manager.object;
        const unitOptions = unit.options;
        const move = unitOptions.move;
        const moveDestination = move ? move.destination : null;
        if (!move) throw new Error('Unit Move feature is required');
        if (!moveDestination) throw new Error('Unit Move feature destination is required');
    }

    update() {
        const manager = this.manager;
        const unit = manager.object;
        const unitOptions = unit.options;
        const object3D = unit.object3D;
        const speed = unitOptions.move.speed;
        const destination = unitOptions.move.destination;
        const groundOffset = unitOptions.move.groundOffset;

        this.navigation.addAgent(
            object3D, 
            destination, 
            speed, 
            groundOffset,
            this.acceptableDistance
        );
    }

    isComplete() {
        const manager = this.manager;
        const unit = manager.object;
        const unitOptions = unit.options;
        const object3D = unit.object3D;
        const destination = unitOptions.move.destination;
        const acceptableDistance = this.acceptableDistance; 

        return this.navigation.reachedDestination(
            object3D, 
            destination, 
            acceptableDistance
        );
    }
}

class MoveToAttack extends MoveTo {
    constructor(manager, options={}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.options;
        const attack = unitOptions.attack;
        const move = unitOptions.move;
        const target = manager.target;
        if (!attack) throw new Error('Unit Attack feature is required');
        if (!target) throw new Error('Manager target is required');
        if (!move) throw new Error('Unit Move feature is required');
        move.destination = target.position;
        this.acceptableDistance = attack.distance;
    }

}


class MoveToTarget extends Base {
    constructor(manager, options={}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.options;
        const move = unitOptions.move;
        const target = manager.target;
        if (!move) throw new Error('Unit Move feature is required');
        if (!target) throw new Error('Manager target is required');
    }

    exit() {
        const manager = this.manager;
        const unit = manager.object;
        const unitOptions = unit.options;
        const managerTarget = manager.target;

        unitOptions.move.destination = managerTarget.position;
    }

    isComplete() {
        return true;
    }
}

class FindClosest extends Base {
    constructor(manager, options={}) {
        super(manager, options);       
        
        const unit = manager.object;
        const unitOptions = unit.options;
        const collect = unitOptions.collect;
        const scan = unitOptions.scan;
        const attack = unitOptions.attack;  
        if (!collect && !scan && !attack) 
            throw new Error('Unit Collect, Scan, or Attack feature is required');

        this.map = useHeightMap();
        this.target = null;
    }

    update() {
        const manager = this.manager;
        const unit = manager.object;
        const unitOptions = unit.options;
        const object3D = unit.object3D;
        const type = this.options.type;
        const position = object3D.position;
        const team = unit.team;
        
        if (type === 'resource') {
            const resourceManager = useResources();
            const collect = unitOptions.collect;
            const targetType = collect.type;
            this.target = resourceManager.findClosest(position, targetType);
        }
        else if (type === 'construction') {
            const itemsManager = useItems();
            const collect = unitOptions.collect;
            const scan = unitOptions.scan;
            const constructionName = collect
                ? collect.deliver_construction
                : scan.deliver_construction;

            this.target = itemsManager.findClosestByNameAndTeam(
                position, 
                constructionName,
                team
            );
        } else if (type === 'enemy') {
            const healthManager = useHealth();
            const closestResult = healthManager.findClosestNotOnTeam(team, position);
            const closestObject = closestResult?.healthObject?.object3D;
            if (!closestObject) {
                console.log('No health objects found, regrouping');
                const unitsManager = useUnits();
                unitsManager.setStateByFunction('warrior', 'regroup', team);
                return;
            }
            
            this.target = closestObject;
        }
    }

    exit() {
        if (!this.target) return;

        const manager = this.manager;
        const unit = manager.object;
        const unitOptions = unit.options;
        const collect = unitOptions.collect;
        const scan = unitOptions.scan;
        const attack = unitOptions.attack;
        const move = unitOptions.move;
        const targetPosition = this.target.position;
        //targetPosition.y = this.map.getY(targetPosition.x, targetPosition.z)

        if (collect) {
            collect.target = this.target;
            manager.target = collect.speed;
        }
        else if (scan) {
            scan.target = this.target;
            manager.target = scan.speed;
        }
        else if (attack) {
            manager.target = this.target;
        }
        
        move.destination = targetPosition;
    }

    isComplete() {
        return !!this.target;
    }
}

class FindRandom extends Base {
    constructor(manager, options={}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.options;
        const collect = unitOptions.collect;
        const scan = unitOptions.scan;
        if (!collect && !scan) throw new Error('Unit Collect or Scan feature is required');
        this.target = null;
    }

    update() {
        const manager = this.manager;
        const unit = manager.object;
        const unitOptions = unit.options;
        const object3D = unit.object3D;
        const type = this.options.type;
        const position = object3D.position;

        if (type === 'resource') {
            this.target = useResources().getRandom().object3D;
        }
        else if (type === 'construction') {
            const targetType = unitOptions.scan.deliver_construction;
            this.target = useItems().findClosestItem(position, targetType);
        }
    }

    exit() {
        if (!this.target) return;

        const manager = this.manager;
        const unit = manager.object;
        const unitOptions = unit.options;
        const collect = unitOptions.collect;
        const scan = unitOptions.scan;
        const move = unitOptions.move;
        const targetPosition = this.target.position;

        if (collect) {
            collect.target = this.target;
            manager.target = collect.speed;
        }
        else if (scan) {
            scan.target = this.target;
            manager.target = scan.speed;
        }
        
        move.destination = targetPosition;
    }

    isComplete() {
        return !!this.target;
    }
}

class Collect extends Timer {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.options;
        const collect = unitOptions.collect;
        const scan = unitOptions.scan;
        if (!collect && !scan) throw new Error('Unit Collect or Scan feature is required');
        
        const bankManager = useBank();
        this.bank = bankManager.get(unit.team);
        this.costs = collect ? collect.costs : scan.costs;
    }

    exit() {
        if (this.costs) {
            for (const cost of this.costs) {
                this.bank.withdraw(cost.amount, cost.currency);
            }
        }
    }

    isComplete() {
        const timerIsComplete = super.isComplete();
        let canAfford = true;
        if (this.costs) {
            canAfford = this.bank.canAfford(this.costs);
        }

        return (timerIsComplete && canAfford);
    }
}

class Deliver extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.options;
        const collect = unitOptions.collect;
        const scan = unitOptions.scan;
        if (!collect && !scan) throw new Error('Unit Collect or Scan feature is required');

        const bankManager = useBank();
        this.bank = bankManager.get(unit.team);
        this.amount = collect ? collect.max : scan.rate;
        this.type = collect ? collect.type : scan.type;
    }

    exit() {
        this.bank.deposit(this.amount, this.type);
    }

    isComplete() {
        return true
    }
}

class Regroup extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.options;
        const move = unitOptions.move;
        const team = unit.team;

        const players = usePlayers();
        const player = players.get(team);
        const command = useCommands().createOrFindCommand(team);
        
        if (!move) throw new Error('Unit Move feature is required');
        if (!command) throw new Error('Unit Command is required');

        move.destination = command.position;
    }

    isComplete() {
        return true;
    }
}

const hidden = new THREE.Vector3(-1000, -1000, -1000);
class Attack extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.options;
        const attack = unitOptions.attack;
        const target = manager.target;
        if (!attack) throw new Error('Unit Attack feature is required');
        if (!target) throw new Error('Manager target is required');

        this.distance = attack.distance;
        this.rate = attack.rate;
        this.damage = attack.damage;
        this.nextAttack = Date.now();
        this.healthManager = useHealth();
        this.playMuzzleParticle = () => {
            if (!attack.muzzleParticle) return;
            useParticles().play(`${unit.object3D.uuid}-muzzle`, null, null, unit.object3D, target, attack.muzzleParticle.force);
        }
        this.stopMuzzleParticle = () => {
            if (!attack.muzzleParticle) return;
            useParticles().setPosition(`${unit.object3D.uuid}-muzzle`, hidden);
        }
        this.playHitParticle = (target) => {
            if (!attack.hitParticle) return;
            useParticles().play(`${unit.object3D.uuid}-hit`, null, null, target);
        }
        this.stopHitParticle = () => {
            if (!attack.hitParticle) return;
            useParticles().setPosition(`${unit.object3D.uuid}-hit`, hidden);
        }
    }

    resetAttack() {
        this.nextAttack = Date.now() + this.rate;
    }

    attack() {
        if (!this.manager.target) return;

        const manager = this.manager;
        const unit = manager.object;
        const object3D = unit.object3D;
        const target = manager.target;
        const team = unit.team;
        const damage = this.damage;
        const distance = object3D.position.distanceTo(target.position);
        
        if (distance < this.distance) {
            //this.playMuzzleParticle();
            //this.playHitParticle(target);
            this.resetAttack();
            this.healthManager.applyDamage(
                target, 
                damage, 
                object3D, 
                team
            );
            
            const targetIsDead = this.healthManager.isDead(target);
            if (targetIsDead) {
                manager.target = null;
            }
        }
    }

    update() {
        if (Date.now() > this.nextAttack) {
            this.attack();
        }
    }

    exit() {
        //this.stopMuzzleParticle();
        //this.stopHitParticle();
    }

    isComplete() {
        const manager = this.manager;
        const target = manager.target;
        if (!target) return true;

        const unit = manager.object;
        const object3D = unit.object3D;
        const distance = object3D.position.distanceTo(target.position);
        return distance > this.distance;
    }
}

export default {
    TIMER: Timer,
    MOVE_TO: MoveTo,
    FIND_CLOSEST: FindClosest,
    FIND_RANDOM: FindRandom,
    COLLECT: Collect,
    DELIVER: Deliver,
    WAIT: Wait,
    REGROUP: Regroup,
    ATTACK: Attack,
    MOVE_TO_TARGET: MoveToTarget,
    MOVE_TO_ATTACK: MoveToAttack
}
