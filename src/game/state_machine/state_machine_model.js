
/**
 * Set the manager's action to the action at the given index.
 * 
 * @param {object} manager
 * @param {number} nextActionIndex
 * @returns {void}
 */
const setAction = async (manager, nextActionIndex) => {
    manager.actionIndex = nextActionIndex;

    if (manager.action) {
        await manager.action.exit();
    }

    const action = manager.state.actions[nextActionIndex];
    const method = action.method.toUpperCase();
    const nextClazz = manager.stateMethods[method];
    
    manager.action = new nextClazz(manager, action.options);

    await manager.action.enter();
}

/**
 * Move the manager to the next state action.
 * 
 * @param {object} manager
 * @returns {void}
 */
const moveToNextAction = async (manager) => {
    const actionIndex = manager.actionIndex;
    const nextActionIndex = (actionIndex + 1) % manager.state.actions.length;
    await setAction(manager, nextActionIndex);
}

/**
 * Check if the manager has a state.
 * 
 * @param {object} manager
 * @returns {boolean}
 */
const hasState = (manager) => {
    return manager.state !== null && manager.state !== undefined;
}

/**
 * Check if the manager has an action.
 * 
 * @param {object} manager
 * @returns {boolean}
 */
const hasAction = (manager) => {
    return manager.action !== null && manager.action !== undefined;
}

/**
 * Set the manager to the state macthing the index.
 * 
 * @param {object} manager
 * @param {number} index
 * @returns {void}
 */
const setState = (manager, index) => {
    manager.state = manager.behavior.states[index];
}

/**
 * Is the manager's action complete?
 * 
 * @param {object} manager
 * @returns {boolean}
 */
const isActionComplete = async (manager) => {
    return await manager.action?.isComplete();
}

/**
 * Update the manager.
 * 
 * @param {object} manager
 * @returns {void}
 */
const update = async (manager) => {
    if (!hasState(manager)) {
        setState(manager, 0);
        return;
    }
    if (!hasAction(manager)) {
        setAction(manager, 0);
        return;
    }
    
    if (await isActionComplete(manager)) {
        await moveToNextAction(manager);
        return;
    }

    await manager.action?.update();
}

/**
 * State Machine Manager Model.
 * 
 * @param {string} id
 * @param {object} object
 * @param {object} behavior
 * @param {object} stateMethods
 * @param {number} actionIndex
 * @param {object} action
 * @param {object} state
 * @param {object} target
 * @returns {object}
 */
export default (
    id,
    object,
    behavior,
    stateMethods,
    actionIndex = 0,
    action = null,
    state = null,
    target = null
) => {
    if (!object) throw new Error('object is required');
    if (!behavior) throw new Error('behavior is required');
    if (!stateMethods) throw new Error('stateMethods is required');
    if (!id) throw new Error('id is required');

    const data = {
        id,
        object,
        behavior,
        stateMethods,
        actionIndex,
        action,
        state,
        target,
    }

    return {
        data,
        setAction: async (nextActionIndex) => await setAction(data, nextActionIndex),
        moveToNextAction: async () => await moveToNextAction(data),
        update: async () => await update(data),
        setState: (index) => setState(data, index),
        hasState: () => hasState(data),
        hasAction: () => hasAction(data),
        isActionComplete: async () => await isActionComplete(data),
    }
}
