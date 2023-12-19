import MarkerController from './marker_controller.js';
import { ref } from 'vue';
import { useCollision } from '../../../composables/collision.js';
import { useBank } from '../../bank/bank.js';
import { useItems } from '../../constructions/constructions.js';
import { useGround } from '../../map/ground.js';
import { removeMesh } from '../../../composables/meshes.js';
import { useObjectives } from '../../objectives/objectives.js';
import { useToast } from '../../../composables/toast.js';
import { getPosition } from '../../../composables/helpers/grid_helper.js';
import { usePlayers } from '../../players/player.js';
import { useCanvas } from '../../../composables/canvas.js';
import { useHealth } from '../../../composables/health.js';
import * as THREE from 'three';

const collisionManager = useCollision();

const isMoving = ref(false);
const lastPosition = ref(null);

const placingMaterials = ref({});

const acceptablePlacementDistance = 20;
const hitCooldown = 5000;
const moveLength = 3;
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

const setupMovingVisual = (selected, placed = false) => {
    const transparent = placed ? false : true;
    const opacity = placed ? 1 : 0.5;

    const setToOriginalMaterial = (child) => {
        if (child.isMesh) {
            const data = placingMaterials.value[child.uuid];
            const original = data.original;
            const clone = data.clone
            child.material = original;
            clone.dispose();
        }
    }

    const setToCloneMaterial = (child) => {
        if (child.isMesh) {
            const original = child.material;    
            const clone = original.clone();
            clone.transparent = transparent;
            clone.opacity = opacity;
            child.material = clone;
            placingMaterials.value[child.uuid] = {clone, original}
        }
    }

    selected.value.traverse((child) => {
        if (child.isMesh) {
            if (placed) setToOriginalMaterial(child);
            else setToCloneMaterial(child);
        }
    });
}

const MoveController = {
    start: (selected) => {
        if (isMoving.value) return false;
        if (!selected.value) return false;
        if (!MoveController.isMoveable(selected)) return false;

        isMoving.value = true,
        lastPosition.value = selected.value.position.clone();

        setupMovingVisual(selected);
        
        return true;
    },
    cancel: (selected) => {
        if (!isMoving.value) return false;

        isMoving.value = false;
        setupMovingVisual(selected, true);

        if (selected.value.userData.isOwned) {
            selected.value.position.copy(lastPosition.value);
        } else {
            const canvas = useCanvas();
            const adapter = canvas.adapter.value;
            const scene = adapter.scene;

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

        setupMovingVisual(selected, true);

        /**
         * Check if the selected item is too close to an enemy building.
         */
        const constructions = useItems();
        const team = selected.value.userData.team;
        const closestNonTeamConstruction = constructions.findClosestNotOnTeam(selected.value.position, team);
        if (closestNonTeamConstruction && closestNonTeamConstruction.position.distanceTo(selected.value.position) < acceptablePlacementDistance) {
            useToast().add('toasts.move_controller.too_close_to_enemy_building', 4000, 'danger');
            return false;
        }

        if (!selected.value.userData.isOwned) {
            
            const bankManager = useBank();
            const bank = bankManager.get(team);
            const canAfford = bank.canAfford(selected.value.userData.costs);

            if (canAfford) {
                for (const cost of selected.value.userData.costs) {
                    bank.withdraw(cost.amount, cost.currency);
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

        usePlayers().savePlayers();
        
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
    isMoveable: (selected) => {
        if (!selected.value) return false;

        /**
         * Do not allow moving within 5 seconds after being hit.
         */
        const userData = selected.value.userData;
        const upgrade = userData.upgrades[userData.upgrade.index];
        const features = upgrade.features;
        const healthFeature = features.find(f => f.name === 'health');
        if (healthFeature) {
            
            const isUnderAttack = useHealth().isHittedWithin(selected.value, hitCooldown);
            if (isUnderAttack) {
                useToast().add('toasts.move_controller.under_attack', 4000, 'danger');
                return false;
            }
        }

        return true;
    },
    isMoving
}

export default MoveController;
