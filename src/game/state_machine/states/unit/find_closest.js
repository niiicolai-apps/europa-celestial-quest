import Base from '../base.js'
import { useResources } from '../../../map/resources.js';
import { useItems } from '../../../constructions/constructions.js';
import { useUnits } from '../../../units/units.js';
import { useHealth } from '../../../health/health.js';
import { useCommands } from '../../../units/commands.js';
import { useStateMachine } from '../../state_machine.js';

export default class FindClosest extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.features;
        const collect = unitOptions.collect;
        const scan = unitOptions.scan;
        const attack = unitOptions.attack;
        if (!collect && !scan && !attack)
            throw new Error('Unit Collect, Scan, or Attack feature is required');

        this.target = null;
    }

    update() {
        const manager = this.manager;
        const unit = manager.object;
        const unitOptions = unit.features;
        const object3D = unit.object3D;
        const type = this.options.type;
        const position = object3D.position;
        const team = unit.team;

        if (type === 'resource') {
            const resourceManager = useResources();
            const collect = unitOptions.collect;
            const targetType = collect.type;
            const resource = resourceManager.findClosest(position, targetType);
            
            if (resource) {
                this.target = resource;
            }
        }
        else if (type === 'construction') {
            const itemsManager = useItems();
            const collect = unitOptions.collect;
            const scan = unitOptions.scan;
            const constructionName = collect
                ? collect.deliver_construction
                : scan.deliver_construction;

            const closestResult = itemsManager.findClosestByNameAndTeam(
                position,
                constructionName,
                team
            );
            const closestObject = closestResult?.construction?.object3D;
            if (closestObject) {
                this.target = closestObject; 
            }
            
        } else if (type === 'enemy') {
            const commandoManager = useCommands();
            const command = commandoManager.getCommand(team);

            const healthManager = useHealth();
            const closestResult = healthManager.findClosestNotOnTeam(team, command.position);
            const closestObject = closestResult?.closest?.object3D;

            if (!closestObject) {
                console.log('No health objects found, regrouping');
                useStateMachine().setState(unit.object3D.uuid, 'regroup');
                return;
            }

            this.target = closestObject;
        }
    }

    exit() {
        if (!this.target) return;

        const manager = this.manager;
        const unit = manager.object;
        const unitOptions = unit.features;
        const collect = unitOptions.collect;
        const scan = unitOptions.scan;
        const attack = unitOptions.attack;
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
        else if (attack) {
            manager.target = this.target;
        }

        move.destination = targetPosition;        
    }

    isComplete() {
        return this.target !== null && this.target !== undefined;
    }
}