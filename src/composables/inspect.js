import { ref } from 'vue';
import WebGL from 'frontend-webgl';
import MoveController from './inspect/move_controller.js';
import SellController from './inspect/sell_controller.js';
import UpgradeController from './inspect/upgrade_controller.js';
import { useGround } from './ground.js';

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
        if (MoveController.cancel(selected))
            selectableManager.value.enable();
    },
    confirm: () => {
        if (MoveController.confirm(selected))
            selectableManager.value.enable();
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
        if (SellController.confirm(selected))
            selectableManager.value.enable();
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
        if (UpgradeController.confirm(selected))
            selectableManager.value.enable();
    },
    isUpgrading: UpgradeController.isUpgrading
}

groundManager.addOnIntersect((point) => {
    if (!selected.value) return;
    MoveController.onClick(selected, point);
});

export const useInspect = () => {

    const onSelect = (selectable) => {
        selected.value = selectable;
        console.log('onSelect', selectable);
    }

    const onDeselect = (selectable) => {
        selected.value = null;
        console.log('onDeselect', selectable);
    }

    const enable = (camera, renderer) => {
        if (isInitialized.value) return;

        selectableManager.value = WebGL.composables.useSelectable(renderer.domElement, camera, {
            deselectOnDoubleClick: false,
            autoDeselect: true,
            onSelect,
            onDeselect,
        });

        selectableManager.value.enable();

        isInitialized.value = true;
    }

    const disable = () => {
        if (!isInitialized.value) return;

        isInitialized.value = false;
        selectableManager.value.disable();
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
        upgradeCtrl
    }
}