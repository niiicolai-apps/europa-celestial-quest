import { ref } from 'vue';

/**
 * A list of manager objects
 * @type {object[]}
 * @private
 */
const managers = ref([]);

export const useManager = () => {

    /**
     * returns a sorted list
     * 
     * @returns {void}
     * @private
     */
    const getMethodSorted = (methodName) => {
        const methods = managers.value.map(m => m.methods[methodName]).filter(m => m);
        const sorted = methods.sort((a, b) => {
            if (a.priority < b.priority) return -1;
            if (a.priority > b.priority) return 1;
            return 0;
        });
        return sorted;
    }

    /**
     * Creates a new manager
     * 
     * @param {string} id - Must be unique
     * @param {object} methods - Contains manager methods
     * @returns {void}
     * @public
     */
    const create = (id, methods={}) => {
        if (!id) {
            throw new Error(`Manager id is required`);
        }

        if (!methods) {
            throw new Error(`Manager methods is required`);
        } 

        if (managers.value.find(m => m.id === id)) {
            return;
        }

        managers.value.push({id, methods});
    }

    /**
     * Destroys a manager
     * 
     * @param {string} id - Must be unique
     * @returns {void}
     * @public
     */
    const destroy = (id) => {
        if (!id) {
            throw new Error(`Manager id is required`);
        }

        const index = managers.value.findIndex(m => m.id === id);
        if (index === -1) {
            throw new Error(`Manager not found: ${id}`);
        }

        managers.value.splice(index, 1);
    }

    /**
     * Runs a manager method
     * 
     * @param {string} methodName - The method name
     * @param {object} options - Contains method options
     * @returns {void}
     * @public
     */
    const runMethod = async (methodName) => {
        if (!methodName) {
            throw new Error(`Method name is required`);
        }

        const methods = getMethodSorted(methodName);
        for (const method of methods) {
            if (method) await method.callback();
        }
    }

    /**
     * Expose public methods
     */
    return {
        create,
        destroy,
        runMethod
    }
}
