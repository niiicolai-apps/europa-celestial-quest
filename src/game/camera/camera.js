import { useManager } from '../managers/manager.js'
import { useCanvas } from '../../composables/canvas.js'
import PersistentData from '../persistent_data/persistent_data.js'
import CameraController from './camera_controller.js';

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('camera', {
    init: {
        priority: 1,
        callback: async () => {
            const camera = useCanvas().getCamera();
            const renderer = useCanvas().getRenderer();
            CameraController.create(camera, renderer.domElement);
        }
    },
    enable: {
        priority: 1,
        callback: async () => CameraController.setEnable(true)
    },
    disable: {
        priority: 1,
        callback: async () => CameraController.setEnable(false)
    },
    onAnimate: {
        priority: 1,
        callback: async () => CameraController.update()
    },
    onBeforeTimeline: {
        priority: 1,
        callback: async () => CameraController.setEnable(false)
    },
    onAfterTimeline: {
        priority: 1,
        callback: async () => CameraController.setEnable(true)
    }
})

/**
 * Camera interface.
 */
export default {
    setZoomSpeed: (value) => {
        CameraController.setZoomSpeed(value);
        PersistentData.set('camera_zoom_speed', { value });
    },
    setMoveSpeed: (value) => {
        CameraController.setMoveSpeed(value);
        PersistentData.set('camera_move_speed', { value });
    },
    setPosition: (position) => CameraController.setPosition(position),
}
