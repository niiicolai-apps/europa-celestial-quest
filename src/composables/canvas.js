import { ref } from 'vue';
import Camera from '../managers/camera.js';
import * as THREE from 'three';

const adapter = ref(null);
const webGLOptions = { camera: { ...Camera.options } };

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

    return {
        adapter,
        webGLOptions,
        enable,
        disable
    }
}
