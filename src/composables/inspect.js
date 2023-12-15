import { ref } from 'vue';
import WebGL from 'frontend-webgl';
import MoveController from './inspect/move_controller.js';
import SellController from './inspect/sell_controller.js';
import UpgradeController from './inspect/upgrade_controller.js';
import UnitController from './inspect/unit_controller.js';
import MarkerController from './inspect/marker_controller.js';
import * as THREE from 'three';
import { useGround } from './ground.js';

const scene = ref(null);
const selected = ref(null);
const selectableManager = ref(null);
const isInitialized = ref(false);
const groundManager = useGround();

const moveCtrl = {
    start: () => {
        if (MoveController.start(selected))
            selectableManager.value.disable();
    },
    cancel: () => {
        if (MoveController.cancel(selected, scene.value)) {
            selectableManager.value.enable();
            if (!selected.value.userData.isOwned) {
                selectableManager.value.removeSelected();
            }
        }
    },
    confirm: () => {
        if (MoveController.confirm(selected, scene.value)) {
            selectableManager.value.enable();
        }
    },
    moveForward: () => {
        MoveController.moveForward(selected);
    },
    moveBackward: () => {
        MoveController.moveBackward(selected);
    },
    moveLeft: () => {
        MoveController.moveLeft(selected);
    },
    moveRight: () => {
        MoveController.moveRight(selected);
    },
    rotateLeft: () => {
        MoveController.rotateLeft(selected);
    },
    rotateRight: () => {
        MoveController.rotateRight(selected);
    },
    isMoving: MoveController.isMoving
}

const sellCtrl = {
    start: () => {
        if (SellController.start(selected))
            selectableManager.value.disable();
    },
    cancel: () => {
        if (SellController.cancel(selected))
            selectableManager.value.enable();
    },
    confirm: () => {
        if (SellController.confirm(selected, scene.value)) {
            selectableManager.value.enable();
            selectableManager.value.removeSelected();
        }
    },
    isSelling: SellController.isSelling
}

const upgradeCtrl = {
    start: () => {
        if (UpgradeController.start(selected))
            selectableManager.value.disable();
    },
    cancel: () => {
        if (UpgradeController.cancel(selected))
            selectableManager.value.enable();
    },
    confirm: () => {
        if (UpgradeController.confirm(selected)) {
            selectableManager.value.enable();
        }
    },
    isUpgradeable: () => UpgradeController.isUpgradeable(selected),
    isMaxUpgradeReached: () => UpgradeController.isMaxUpgradeReached(selected),
    isUpgrading: UpgradeController.isUpgrading    
}

const unitCtrl = {
    start: () => {
        if (UnitController.start(selected))
            selectableManager.value.disable();
    },
    cancel: () => {
        if (UnitController.cancel(selected))
            selectableManager.value.enable();
    },
    getAllowedUnits: () => UnitController.getAllowedUnits(selected),
    getQueue: () => UnitController.getQueue(selected),
    dequeueAny: () => UnitController.dequeueAny(selected, scene.value),
    queueUnit: async (unitName) => await UnitController.queueUnit(selected, unitName),
    canBuild: () => UnitController.canBuild(selected),
    isBuilding: UnitController.isBuilding
}

groundManager.addOnIntersect((point) => {
    if (!selected.value) return;
    MoveController.onClick(selected, point);
});

export const useInspect = () => {

    const onSelect = (selectable) => {
        // Find parent selectable
        let parent = selectable;
        while (true) {
            if (!parent) break;
            if (!parent.parent) break;
            if (parent.parent.type === 'Scene') break;
            parent = parent.parent;
        } 
        selected.value = parent;
        MarkerController.onSelect(parent);
        console.log('onSelect', parent);
    }

    const onDeselect = (selectable) => {
        selected.value = null;
        MarkerController.onDeselect();
        console.log('onDeselect', selectable);
    }

    const enable = (camera, _scene, domElement) => {
        if (isInitialized.value) return;

        selectableManager.value = WebGL.composables.useSelectable(domElement, camera, {
            deselectOnDoubleClick: false,
            autoDeselect: true,
            onSelect,
            onDeselect,
        });

        MarkerController.init(_scene);

        selectableManager.value.enable();
        scene.value = _scene;
        isInitialized.value = true;
    }

    const disable = () => {
        if (!isInitialized.value) return;

        isInitialized.value = false;
        scene.value = null;
        selectableManager.value.disable();
        MarkerController.dispose();
    }

    const setSelected = (selectable) => {
        if (!isInitialized.value) {
            throw new Error('Inspect is not enabled');
        }
        if (!selectable) {
            throw new Error('Selectable is required');
        }

        selected.value = selectable;
        selectableManager.value.setSelected(selectable);
        MarkerController.onSelect(selectable);
        if (!selectable.userData.isOwned) {
            moveCtrl.start();
        }
    }

    const removeSelected = () => {
        if (!isInitialized.value) {
            throw new Error('Inspect is not enabled');
        }

        selected.value = null;
        selectableManager.value.removeSelected();
        MarkerController.onDeselect();
    }
    
    const addSelectable = (selectable) => {
        if (!isInitialized.value) {
            throw new Error('Inspect is not enabled');
        }
        if (!selectable) {
            throw new Error('Selectable is required');
        }

        selectableManager.value.selectables.add(selectable);
    }

    const removeSelectable = (selectable) => {
        if (!isInitialized.value) {
            throw new Error('Inspect is not enabled');
        }
        if (!selectable) {
            throw new Error('Selectable is required');
        }

        selectableManager.value.selectables.remove(selectable);
    }

    return {
        enable,
        disable,
        setSelected,
        removeSelected,
        selected,
        selectableManager,
        addSelectable,
        removeSelectable,
        moveCtrl,
        sellCtrl,
        upgradeCtrl,
        unitCtrl,
    }
}