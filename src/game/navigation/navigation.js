import { useManager } from '../managers/manager.js';
import NavigationController from './navigation_controller.js';

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('navigation', {
    update: {
        priority: 1,
        callback: () => NavigationController.update()
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => NavigationController.setPaused(true)
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => NavigationController.setPaused(false)
    }
})

/**
 * Navigation interface
 * 
 * @returns {object}
 */
export const useNavigation = () => {

    const add = (object3D, speed=0.1, acceptableDistance = 1, groundOffset=0) => {
        return NavigationController.create(object3D, speed, acceptableDistance, groundOffset);        
    }

    const remove = (object3D) => {
        NavigationController.remove(object3D);
    }

    const find = (object3D) => {
        return NavigationController.getByObject3D(object3D);
    }

    const setDestination = (object3D, destination) => {
        NavigationController.setDestination(object3D, destination);
    }

    const setDestinationToPosition = (object3D) => {
        NavigationController.setDestinationToPosition(object3D);
    }

    const remainingDistance = (object3D) => {
        return NavigationController.remainingDistance(object3D);
    }

    const reachedDestination = (object3D) => {
        return NavigationController.reachedDestination(object3D);
    }

    const isMoving = (object3D) => {
        return NavigationController.isMoving(object3D);
    }

    return {
        add,
        remove,
        find,
        reachedDestination,
        setDestination,
        setDestinationToPosition,
        remainingDistance,
        isMoving
    }
}
