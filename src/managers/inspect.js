import { ref } from 'vue';
import WebGL from 'frontend-webgl';
import MoveController from './inspect/move_controller.js';
import SellController from './inspect/sell_controller.js';
import UpgradeController from './inspect/upgrade_controller.js';
import UnitController from './inspect/unit_controller.js';
import MarkerController from './inspect/marker_controller.js';
import { useGround } from './ground.js';
import { useManager } from './manager.js';
import { useCanvas } from '../composables/canvas.js';
import { usePlayers } from './player.js';

const scene = ref(null);
const selected = ref(null);
const selectedIsYours = ref(false);
const selectableManager = ref(null);
const isInitialized = ref(false);

const detailCtrl = {
    isYours: () => {        
        if (!selected.value) return false;
        const players = usePlayers();
        const player = players.findYou();
        if (!player) return false;
        return selected.value.userData.team === player.team;
    },
    isOthers: () => {
        return !detailCtrl.isYours();
    },
}

const moveCtrl = {
    start: () => {
        if (!selectedIsYours.value) return false;
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
        if (!selectedIsYours.value) return false;
        if (SellController.start(selected))
            selectableManager.value.disable();
    },
    cancel: () => {
        if (SellController.cancel(selected))
            selectableManager.value.enable();
    },
    confirm: () => {
        console.log(scene.value);
        if (SellController.confirm(selected)) {
            selectableManager.value.enable();
            selectableManager.value.removeSelected();
        }
    },
    isSelling: SellController.isSelling
}

const upgradeCtrl = {
    start: () => {
        if (!selectedIsYours.value) return false;
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
        if (!selectedIsYours.value) return false;
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
    isBuilding: () => UnitController.isBuilding
}

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
    selectedIsYours.value = detailCtrl.isYours();
    console.log('onSelect', parent);
}

const onDeselect = () => {
    selected.value = null;
    MarkerController.onDeselect();
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('inspect', {
    init: {
        priority: 1, 
        callback: async () => {
            if (isInitialized.value) return false
            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            const camera = adapter.camera;
            const domElement = adapter.renderer.domElement;
            const scene = adapter.scene;

            selectableManager.value = WebGL.composables.useSelectable(domElement, camera, {
                deselectOnDoubleClick: false,
                autoDeselect: true,
                onSelect,
                onDeselect,
            });
    
            MarkerController.init(scene);
            useGround().addOnIntersect((point) => {
                if (!selected.value) return;
                MoveController.onClick(selected, point);
            });
    
            selectableManager.value.enable();
            scene.value = scene;
            console.log(scene.value);
            isInitialized.value = true;
           
        }
    },
    enable: {
        priority: 1,
        callback: async () => {
            if (!isInitialized.value) return false;
            selectableManager.value.enable();
        }
    },
    disable: {
        priority: 1,
        callback: async () => {
            if (!isInitialized.value) return false;
            selectableManager.value.disable();
        }
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => {
            if (!isInitialized.value) return false;
            selectableManager.value.disable();
            onDeselect();
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
            if (!isInitialized.value) return false;
            selectableManager.value.enable();
        }
    }
})

export const useInspect = () => {

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

    const isSelectable = (selectable) => {
        if (!isInitialized.value) {
            throw new Error('Inspect is not enabled');
        }
        if (!selectable) {
            throw new Error('Selectable is required');
        }

        return selectableManager.value.selectables.has(selectable);
    }

    return {
        setSelected,
        removeSelected,
        selected,
        selectedIsYours,
        selectableManager,
        addSelectable,
        removeSelectable,
        moveCtrl,
        sellCtrl,
        upgradeCtrl,
        unitCtrl,
        isSelectable
    }
}