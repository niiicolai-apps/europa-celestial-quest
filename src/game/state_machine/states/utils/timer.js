import Base from '../Base.js'

/**
 * Timer state
 * 
 * Set manager target to {time: 5000} to set the length of the timer
 * Otherwise the default length is 1000
 * 
 * @class Timer
 * @extends {Base}
 * @param {object} manager
 * @param {object} options
 * @param {number} options.length
 * @param {number} options.endTime
 */
export default class Timer extends Base {
    constructor(manager, options = {}) {
        super(manager, options);
        
        this.length = manager.target?.time || 1000;
        this.endTime = Date.now() + this.length;
    }

    isComplete(now=Date.now()) {
        return now > this.endTime;
    }
}
