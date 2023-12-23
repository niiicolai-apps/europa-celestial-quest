import CollisionController from "./collision_controller.js";

/**
 * Collision interface.
 */
export const useCollision = () => {

    return {
        ...CollisionController,
    }
}
