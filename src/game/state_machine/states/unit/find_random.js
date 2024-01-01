import Base from '../base.js'
import { useResources } from "../../../map/resources.js";
import { useItems } from "../../../constructions/constructions.js";

export default class FindRandom extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.features;
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
        const unitOptions = unit.features;
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
