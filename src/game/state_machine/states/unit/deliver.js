import Base from '../base.js'
import { useBank } from '../../../bank/bank.js';
import { useObjectives } from '../../../objectives/objectives.js';

export default class Deliver extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        const unit = manager.object;
        const unitOptions = unit.features;
        const collect = unitOptions.collect;
        const scan = unitOptions.scan;
        if (!collect && !scan) throw new Error('Unit Collect or Scan feature is required');

        const bankManager = useBank();
        this.bank = bankManager.get(unit.team);
        this.amount = collect ? collect.max : scan.rate;
        this.type = collect ? collect.type : scan.type;
        this.objectivesCheck = scan !== undefined && scan !== null;
    }

    async exit() {
        this.bank.deposit(this.amount, this.type);
        
        if (this.objectivesCheck) {
            await useObjectives().tryCompleteIncompletes();
        }
    }

    isComplete() {
        return true
    }
}