import { ref } from 'vue';
import WebGL from 'frontend-webgl';
import MoveController from './inspect/move_controller.js';
import SellController from './inspect/sell_controller.js';

const selected = ref(null);
const selectableManager = ref(null);
const isInitialized = ref(false);

const moveCtrl = {
    start: () => MoveController.start(selected),
    cancel: () => MoveController.cancel(selected),
    confirm: () => MoveController.confirm(selected),
    isMoving: MoveController.isMoving
}

const sellCtrl = {
    start: () => SellController.start(selected),
    cancel: () => SellController.cancel(selected),
    confirm: () => SellController.confirm(selected),
    isSelling: SellController.isSelling
}

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
        sellCtrl
    }
}