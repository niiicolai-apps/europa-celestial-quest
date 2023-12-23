import { ref } from 'vue';
import { useManager } from '../managers/manager.js';
import { useCanvas } from '../../composables/canvas.js';
import BillboardController from './billboard_controller.js';

/**
 * A reference to the scenes camera.
 *
 * @type {Ref<THREE.Camera>}
 * @private
 */
const camera = ref(null);

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('billboard', {
    init: {
        priority: 1,
        callback: () => camera.value = useCanvas().getCamera()
    },
    slowUpdate: {
        priority: 1,
        callback: () => BillboardController.update()
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => BillboardController.setPaused(true)
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => BillboardController.setPaused(false)
    }
})

/**
 * Billboard interface.
 * 
 * @typedef {Object} Billboard Interface for the billboard.
 */
export const useBillboard = () => {

    /**
     * Create a new billboard for the given object3D.
     * 
     * @param {Object3D} object3D 
     * @returns {Billboard}
     * @public
     */
    const add = (object3D) => {
        return BillboardController.create(object3D, camera.value);
    }

    /**
     * Remove the billboard for the given object3D.
     * 
     * @param {Object3D} object3D
     * @returns {void}
     * @public
     */
    const remove = (object3D) => {
        BillboardController.remove(object3D);
    }

    /**
     * Expose public methods.
     */
    return {
        add,
        remove,
    }
}
