import MarkerController from './marker_controller.js';
import { ref } from 'vue';
import { useCollision } from '../../collision/collision.js';
import { useBank } from '../../bank/bank.js';
import { useItems } from '../../constructions/constructions.js';
import { useGround } from '../../map/ground.js';
import { removeMesh } from '../../models/meshes.js';
import { useObjectives } from '../../objectives/objectives.js';
import { useToast } from '../../../composables/toast.js';
import { getPosition } from '../../../composables/helpers/grid_helper.js';
import { usePlayers } from '../../players/player.js';
import { useCanvas } from '../../../composables/canvas.js';
import { useHealth } from '../../health/health.js';
import { useMax } from '../../map/max.js';
import ConstructionController from '../../constructions/construction_controller.js';
import * as THREE from 'three';

const collisionManager = useCollision();

const isMoving = ref(false);
const lastPosition = ref(null);
const nextPosition = new THREE.Vector3();

const placingMaterials = ref({});

const acceptablePlacementDistance = 20;
const hitCooldown = 5000;
const moveLength = 3;
const worldDown = new THREE.Vector3(0, -1, 0);

const move = (selected, dx, dy, dz) => {
    if (!isMoving.value) return false;
    nextPosition.x = dx + selected.value.position.x;
    nextPosition.y = dy + selected.value.position.y + 10;
    nextPosition.z = dz + selected.value.position.z;

    const point = useGround().getIntersectFromPosition(nextPosition, worldDown);
    if (!point) return false;
    nextPosition.copy(getPosition(point));

    const construction = ConstructionController.findByObject3D(selected.value);
    const placementYOffset = construction.definition.placementYOffset || 0;  
    
    nextPosition.y += placementYOffset;
    
    if (collisionManager.isCollidingAt(selected.value, nextPosition))
        return false;

    selected.value.position.copy(nextPosition);
    MarkerController.onSelect(selected.value);
    return true;
}

const setStartPoint = (selected) => {
    const construction = ConstructionController.findByObject3D(selected.value);
    if (construction.isOwned) return;

    const ground = useGround();
    const groundCameraViewPoint = ground.getGroundAtCameraViewPoint();
    const nextPosition = new THREE.Vector3();
    const getNextPosition = (i, j) => {
        nextPosition.copy(groundCameraViewPoint);
        nextPosition.x += j * moveLength;
        nextPosition.z += i * moveLength;
        return nextPosition;
    }
    const maxLookAtDistance = 10;
    for (let i = 0; i < maxLookAtDistance; i++) {
        let foundPosition = false;
        for (let j = 0; j < maxLookAtDistance; j++) {
            const point = getNextPosition(i, j);

            if (collisionManager.isCollidingAt(selected.value, point)) {
                continue;
            }
            
            selected.value.position.copy(point); 
            move(selected, 0, 0, 0);
            foundPosition = true;
            break;
        }
        if (foundPosition) break;
    }
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
        setStartPoint(selected);
        
        return true;
    },
    cancel: (selected) => {
        if (!isMoving.value) return false;

        isMoving.value = false;
        setupMovingVisual(selected, true);

        const construction = ConstructionController.findByObject3D(selected.value);
        if (construction.isOwned) {
            selected.value.position.copy(lastPosition.value);
        } else {
            useItems().removeItemFromState(selected.value);

            const team = construction.team;
            const playerManager = usePlayers();
            const player = playerManager.get(team);
            player.maxController.recalculateMax()
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
        const construction = ConstructionController.findByObject3D(selected.value);
        const constructions = useItems();
        const team = construction.team;
        const result = constructions.findClosestNotOnTeam(selected.value.position, team);
        const closestConstruction = result.construction;
        
        if (closestConstruction && closestConstruction.object3D.position.distanceTo(selected.value.position) < acceptablePlacementDistance) {
            useToast().add('toasts.move_controller.too_close_to_enemy_building', 4000, 'danger');
            return false;
        }

        if (!construction.isOwned) {
            
            const bankManager = useBank();
            const bank = bankManager.get(team);
            const canAfford = bank.canAfford(construction.definition.costs);

            if (canAfford) {
                for (const cost of construction.definition.costs) {
                    bank.withdraw(cost.amount, cost.currency);
                }
                construction.isOwned = true;
                useObjectives().tryCompleteIncompletes();
            } else {
                useToast().add('toasts.move_controller.cannot_afford', 4000, 'danger');
                return false;
            }
        }
        
        isMoving.value = false;
        lastPosition.value = null;
        useToast().add('toasts.move_controller.success', 4000, 'success');

        const playerManager = usePlayers();
        const player = playerManager.get(team);
        player.saveData();
        player.maxController.recalculateMax()

        useItems().recalculateStorage(team);

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

        const construction = ConstructionController.findByObject3D(selected.value);
        const placementYOffset = construction.definition.placementYOffset || 0;
        point.y += placementYOffset;

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
        const construction = ConstructionController.findByObject3D(selected.value);
        const upgrade = construction.getUpgrade();
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
