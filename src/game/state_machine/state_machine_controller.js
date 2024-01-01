import { ref } from 'vue'
import StateMachineModel from './state_machine_model.js'

const managers = ref([])
const paused = ref(false)

/**
 * Update all managers.
 * 
 * @returns {void}
 */
const update = async () => {
    if (paused.value) return;

    for (const manager of managers.value) {
        await manager.update();
    }
}

/**
 * Set the paused state.
 * 
 * @param {boolean} value
 * @returns {void}
 */
const setPaused = (value) => {
    paused.value = value;
}

/**
 * Find a manager by id.
 * 
 * @param {string} id
 * @returns {object}
 */
const findById = (id) => {
    return managers.value.find(manager => manager.data.id === id);
}

/**
 * Create a new manager.
 * 
 * @param {string} id
 * @param {object} data
 * @param {object} behavior
 * @param {object} stateMethods
 * @returns {object}
 */
const create = (id, data, behavior, stateMethods, model=StateMachineModel) => {
    if (findById(id)) throw new Error(`Manager with id ${id} already exists`);

    const manager = model(id, data, behavior, stateMethods);
    managers.value.push(manager);
    return manager;
}

/**
 * Remove a manager.
 * 
 * @param {string} id
 * @returns {void}
 */
const remove = (id) => {
    const index = managers.value.findIndex(manager => manager.data.id === id);
    if (index !== -1) {
        managers.value.splice(index, 1);
    }
}

/**
 * Set the state of a manager.
 * 
 * @param {string} id
 * @param {string} stateName
 * @param {object} target
 * @returns {void}
 */
const setState = async (id, stateName, target=null) => {
    if (!id) throw new Error('id is required');
    if (!stateName) throw new Error('stateName is required');

    const manager = findById(id);
    if (!manager) throw new Error(`Manager not found: ${id}`);

    const stateIndex = manager.data.behavior.states.findIndex(s => s.name === stateName);
    if (stateIndex === -1) throw new Error(`State not found: ${stateName}`);
    
    manager.data.target = target;
    manager.setState(stateIndex);
    await manager.setAction(0);
}

export default {
    managers,
    paused,
    update,
    setPaused,
    create,
    remove,
    setState,
    findById
}
