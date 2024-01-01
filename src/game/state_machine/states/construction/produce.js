import { useBank } from "../../../bank/bank.js";
import Base from '../base.js'

export default class Produce extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        if (!manager.object.features.produce) 
            throw new Error('Manager Produce feature is required');
    }

    exit() {
        const manager = this.manager;
        const construction = manager.object
        const team = construction.team
        const upgrade = construction.getUpgrade()
        const produceFeature = upgrade.features.find(feature => feature.name === 'produce')
        const currency = produceFeature.options.type
        const amount = produceFeature.options.rate
        const bank = useBank().get(team);

        const isFull = (bank.getBalance(currency) >= bank.getMax(currency))
        if (isFull) return;

        const costs = produceFeature.options.costs
        if (costs) {
            const min = 10
            for (const cost of costs) {
                if (bank.getBalance(cost.currency) < cost.amount + min) {
                    manager.target = 1000;
                    return;
                }
            }

            for (const cost of costs) {
                bank.withdraw(cost.amount, cost.currency)
            }
        }

        bank.deposit(amount, currency)
        manager.target = { time: produceFeature.options.speed };
    }

    isComplete() {
        return true;
    }
}