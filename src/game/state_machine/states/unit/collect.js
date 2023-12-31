import Base from '../Base.js'
import { useBank } from '../../../bank/bank.js';
import Timer from '../utils/Timer.js';

export default class Collect extends Timer {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.features;
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