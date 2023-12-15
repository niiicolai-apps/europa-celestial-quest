import MarkerController from './marker_controller.js';
import { ref } from 'vue';
import { useCollision } from '../collision.js';
import { useBank } from '../../managers/bank.js';
import { useItems } from '../../managers/constructions.js';
import { useGround } from '../../managers/ground.js';
import { removeMesh } from '../meshes.js';
import { useObjectives } from '../../managers/objectives.js';
import { useToast } from '../toast.js';
import { getPosition } from '../helpers/grid_helper.js';
import * as THREE from 'three';

const bankManager = useBank();
const collisionManager = useCollision();

const moveLength = 3;
const isMoving = ref(false);
const lastPosition = ref(null);
const worldDown = new THREE.Vector3(0, -1, 0);

const move = (selected, dx, dy, dz) => {
    if (!isMoving.value) return false;

    const nextPosition = selected.value.position.clone();
    nextPosition.x += dx;
    nextPosition.y += dy;
    nextPosition.z += dz;

    const point = useGround().getIntersectFromPosition(nextPosition, worldDown);
    if (!point) return false;
    nextPosition.copy(getPosition(point));

    const placementYOffset = selected.value.userData.placementYOffset || 0;
    const box3 = new THREE.Box3().setFromObject(selected.value);
    const size = box3.getSize(new THREE.Vector3());
    nextPosition.y += (size.y / 2) + placementYOffset;

    if (collisionManager.isCollidingAt(selected.value, nextPosition))
        return false;

    selected.value.position.copy(nextPosition);
    MarkerController.onSelect(selected.value);
    return true;
}

const MoveController = {
    start: (selected) => {
        if (isMoving.value) return false;
        if (!selected.value) return false;

        isMoving.value = true,
            lastPosition.value = selected.value.position.clone();
        return true;
    },
    cancel: (selected, scene) => {
        if (!isMoving.value) return false;

        isMoving.value = false;

        if (selected.value.userData.isOwned) {
            selected.value.position.copy(lastPosition.value);
        } else {
            removeMesh(selected.value);
            scene.remove(selected.value);
            useItems().removeItemFromState(selected.value);
        }
        return true;
    },
    confirm: (selected) => {
        if (!isMoving.value) {
            useToast().add('toasts.move_controller.not_moving', 4000, 'danger');
            return false;
        }

        if (!selected.value.userData.isOwned) {
            const canAfford = useItems().canAfford(selected.value.userData.costs);

            if (canAfford) {
                for (const cost of selected.value.userData.costs) {
                    bankManager.withdraw(cost.amount, cost.currency);
                }
                selected.value.userData.isOwned = true;
                useObjectives().tryCompleteIncompletes();
            } else {
                useToast().add('toasts.move_controller.cannot_afford', 4000, 'danger');
                return false;
            }
        }

        if (selected.value.userData.canStore) {
            useItems().recalculateStorage();
        }

        useItems().saveState();
        isMoving.value = false;
        lastPosition.value = null;
        useToast().add('toasts.move_controller.success', 4000, 'success');
        return true;
        
    },
    moveForward: (selected) => {
        return move(selected, 0, 0, moveLength);
    },
    moveBackward: (selected) => {
        return move(selected, 0, 0, -moveLength);
    },
    moveLeft: (selected) => {
        return move(selected, -moveLength, 0, 0);
    },
    moveRight: (selected) => {
        return move(selected, moveLength, 0, 0);
    },
    rotateLeft: (selected) => {
        if (!isMoving.value) return false;

        selected.value.rotation.y -= Math.PI / 2;
        return true;
    },
    rotateRight: (selected) => {
        if (!isMoving.value) return false;

        selected.value.rotation.y += Math.PI / 2;
        return true;
    },
    onClick: (selected, point) => {
        if (!isMoving.value)
            return false;

        const placementYOffset = selected.value.userData.placementYOffset || 0;
        const box3 = new THREE.Box3().setFromObject(selected.value);
        const size = box3.getSize(new THREE.Vector3());
        point = getPosition(point);
        point.y += (size.y / 2) + placementYOffset;

        if (collisionManager.isCollidingAt(selected.value, point))
            return false;

        selected.value.position.copy(point);
        MarkerController.onSelect(selected.value);
        return true;
    },
    isMoving
}

export default MoveController;
