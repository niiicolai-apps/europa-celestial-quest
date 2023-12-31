import { useItems } from "../../../constructions/constructions.js";
import Base from '../Base.js'

export default class TrySpawn extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const upgrade = manager.object.getUpgrade();
        const units = upgrade.units;
        if (!units) throw new Error('Manager Spawn feature is required');
    }

    exit() {
        this.manager.target = { time: 1000 };
        useItems().dequeueAny(this.manager.object.object3D)
    }

    isComplete() {
        return true;
    }
}
