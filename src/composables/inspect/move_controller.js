import { ref } from 'vue';
import { useCollision } from '../collision.js';
import { useGrid } from '../grid.js';
import { useBank } from '../bank.js';
import { useItems } from '../items.js';

import * as THREE from 'three';

const grid = useGrid();
const bankManager = useBank();
const itemsManager = useItems();
const collisionManager = useCollision();

const moveLength = 3;
const isMoving = ref(false);
const lastPosition = ref(null);

const MoveController = {
    start: (selected) => {
        if (isMoving.value) return false;
        if (!selected.value) return false;

        isMoving.value = true,
        lastPosition.value = selected.value.position.clone();
        return true;
    },
    cancel: (selected) => {
        if (!isMoving.value) return false;

        isMoving.value = false;
        
        if (selected.value.userData.isOwned) {
            selected.value.position.copy(lastPosition.value);
        } else {
            console.log('Destroying selected (not implemented yet)');
        }
        return true;
    },
    confirm: (selected) => {
        if (!isMoving.value) return false;
        if (!selected.value.userData.isOwned) {
            const canAfford = itemsManager.canAfford(selected.value.userData.costs);

            if (canAfford) {
                for (const cost of selected.value.userData.costs) {
                    bankManager.withdraw(cost.amount, cost.currency);
                }
                selected.value.userData.isOwned = true;
            } else {
                return false;
            }
        }

        itemsManager.saveState();
        isMoving.value = false;
        lastPosition.value = null;
        return true;
    },
    moveForward: (selected) => {
        if (!isMoving.value) return false;

        const nextPosition = selected.value.position.clone();
        nextPosition.z += moveLength;
        nextPosition.copy(grid.getPosition(nextPosition));
        if (collisionManager.isCollidingAt(selected.value, nextPosition))
            return false;
        
        selected.value.position.copy(nextPosition);
        return true;
    },
    moveBackward: (selected) => {
        if (!isMoving.value) return false;

        const nextPosition = selected.value.position.clone();
        nextPosition.z -= moveLength;
        nextPosition.copy(grid.getPosition(nextPosition));
        if (collisionManager.isCollidingAt(selected.value, nextPosition))
            return false;

        selected.value.position.copy(nextPosition);
        return true;
    },
    moveLeft: (selected) => {
        if (!isMoving.value) return false;

        const nextPosition = selected.value.position.clone();
        nextPosition.x -= moveLength;
        nextPosition.copy(grid.getPosition(nextPosition));
        if (collisionManager.isCollidingAt(selected.value, nextPosition))
            return false;

        selected.value.position.copy(nextPosition);
        return true;
    },
    moveRight: (selected) => {
        if (!isMoving.value) return false;

        const nextPosition = selected.value.position.clone();
        nextPosition.x += moveLength;
        nextPosition.copy(grid.getPosition(nextPosition));
        if (collisionManager.isCollidingAt(selected.value, nextPosition))
            return false;

        selected.value.position.copy(nextPosition);
        return true;
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

        const box3 = new THREE.Box3().setFromObject(selected.value);
        const size = box3.getSize(new THREE.Vector3());
        point = grid.getPosition(point);
        point.y = size.y / 2;

        if (collisionManager.isCollidingAt(selected.value, point)) 
            return false;
        
        selected.value.position.copy(point);
        return true;
    },
    isMoving
}

export default MoveController;
