import { ref } from 'vue';
import * as THREE from 'three';

const adapter = ref(null);
const webGLOptions = {
    camera: {
        near: 0.1,
        far: 1000,
    },
 };

export const useCanvas = () => {

    const enable = (canvasRef) => {
        adapter.value = canvasRef.adapter;

        const { renderer } = adapter.value;
        renderer.alpha = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
    }

    const disable = () => {
        adapter.value = null;
    }

    const getCamera = () => {
        return adapter.value.camera;
    }

    const getRenderer = () => {
        return adapter.value.renderer;
    }

    const getScene = () => {
        return adapter.value.scene;
    }

    return {
        adapter,
        webGLOptions,
        enable,
        disable,
        getCamera,
        getRenderer,
        getScene,
    }
}
