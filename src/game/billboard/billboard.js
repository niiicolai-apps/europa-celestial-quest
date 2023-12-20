import { ref } from 'vue';
import { useManager } from '../managers/manager.js';
import { useCanvas } from '../../composables/canvas.js';

const objects = ref([]);
const camera = ref(null);
const isPaused = ref(false);

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('billboard', {
    init: {
        priority: 1,
        callback: () => {
            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            camera.value = adapter.camera
        }
    },
    update: {
        priority: 1,
        callback: () => {
            if (isPaused.value) return;
            for (const object of objects.value) {
                object.lookAt(camera.value.position);
            }
        }
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => {
            isPaused.value = true;
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
            isPaused.value = false;
        }
    }
})

export const useBillboard = () => {

    /**
     * Add an object to the billboard.
     * 
     * @param {Object3D} object3D 
     * @returns {void}
     * @public
     */
    const add = (object3D) => {
        const exist = objects.value.find(o => o.uuid === object3D.uuid);
        if (exist) return;

        objects.value.push(object3D);
    }

    /**
     * Remove an object from the billboard.
     * 
     * @param {Object3D} object3D
     * @returns {void}
     * @public
     */
    const remove = (object3D) => {
        objects.value = objects.value.filter(o => o.uuid !== object3D.uuid);
    }

    /**
     * Expose public methods.
     */
    return {
        add,
        remove,
    }
}