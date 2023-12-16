import { ref } from 'vue'
import { useManager } from './manager.js'

const managers = ref([])
const paused = ref(false)

const setAction = (manager, actionIndex) => {
    manager.actionIndex = actionIndex;

    if (manager.action) {
        manager.action.exit();
    }

    const action = manager.state.actions[actionIndex];
    const method = action.method.toUpperCase();
    const nextClazz = manager.states[method];
    manager.action = new nextClazz(manager, action.options);
    manager.action.enter();
}

const moveToNextAction = (manager) => {
    const actionIndex = manager.actionIndex;
    const nextActionIndex = (actionIndex + 1) % manager.state.actions.length;
    setAction(manager, nextActionIndex);
}

const update = () => {
    if (paused.value) return;
    for (const manager of managers.value) {

        if (!manager.state) {
            manager.state = manager.behavior.states[0];
        }

        if (!manager.action) {
            setAction(manager, 0);
        }

        if (manager.action?.isComplete()) {
            moveToNextAction(manager);
        }

        manager.action?.update();
    }
}

/**
 * Manager methods.
 * Will be called by the manager.
 */ 
useManager().create('statemachine', {
    update: {
        priority: 1,
        callback: () => update()
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => {
            paused.value = true;
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
            paused.value = false;
        }
    }
})

export const useStateMachine = () => {

    const add = (object, id=Date.now(), behavior={}, states={}) => {
        if (!object) throw new Error('object is required');
        if (!behavior) throw new Error('behavior is required');
        if (!states) throw new Error('states is required');
        if (!id) throw new Error('id is required');
        if (getById(id)) throw new Error('id already exists');

        const manager = {
            id,
            object: {...object},
            behavior,
            states,
            actionIndex: 0,
            action: null,            
            state: null,
            target: null            
        };

        managers.value.push(manager);
    }

    const remove = (id) => {
        if (!id) throw new Error('id is required');
        
        const index = managers.value.findIndex(m => m.id === id);
        if (index !== -1) {
            managers.value.splice(index, 1);
        }
    }

    const getById = (id) => {
        if (!id) throw new Error('id is required');
        
        return managers.value.find(m => m.id === id);
    }

    const setState = (id, stateName) => {
        if (!id) throw new Error('id is required');
        if (!stateName) throw new Error('stateName is required');

        const manager = getById(id);
        if (!manager) throw new Error(`Manager not found: ${id}`);

        const state = manager.behavior.states.find(s => s.name === stateName);
        if (!state) throw new Error(`State not found: ${stateName}`);

        manager.state = state;
        setAction(manager, 0);
    }

    return {
        add,
        remove,
        getById,
        setState,
    }
}
