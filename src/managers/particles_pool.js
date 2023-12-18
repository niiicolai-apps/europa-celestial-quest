import { ref } from 'vue';
import { useParticles } from './particles.js';

/**
 * A list of pools of particles.
 */
const pools = ref([]);

export const useParticlesPool = () => {

    /**
     * Find a pool of particles.
     * 
     * @param {string} type - a string that identifies the type of particles.
     * @returns {object} the pool of particles.
     * @public
     */
    const findPool = (type) => {
        return pools.value.find(p => p.type === type);
    }

    /**
     * Create a pool of particles.
     * 
     * @param {string} type - a string that identifies the type of particles.
     * @param {number} amount - the number of particles to create.
     * @returns {object} the pool of particles.
     * @public
     */
    const create = async (type, amount = 10) => {
        if (!type) throw new Error('Type is required');
        if (!amount) throw new Error('Amount is required');
        if (findPool(type)) throw new Error(`Pool already exists: ${type}`);
        
        const particleManager = useParticles();
        const time = Date.now();
        const particles = [];
        for (let i = 0; i < amount; i++) {
            const id = `${type}_${time}_${i}`;
            const particle = await particleManager.load(id, type);
            particles.push(particle);
        }

        pools.value.push({
            index: 0,
            type,
            amount,
            particles
        });
    }

    /**
     * Get a particle from a pool.
     * Algo:
     * 1. Get a pool of particles.
     * 2. Get the index of the next particle.
     * 3. Increment the index.
     * 4. Return the particle.
     * 
     * @param {string} type - a string that identifies the type of particles.
     * @returns {object} the particle.
     * @public
     */
    const get = (type) => {
        const pool = findPool(type);
        if (!pool) throw new Error(`Pool not found: ${type}`);
        
        const index = pool.index;
        pool.index = (pool.index + 1) % pool.amount;
        return pool.particles[index];
    }

    /**
     * Expose public functions.
     */
    return {
        findPool,
        create,
        get
    }
}
