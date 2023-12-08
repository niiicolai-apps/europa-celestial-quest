import * as THREE from 'three'
import WebGL from 'frontend-webgl'

const currentZoom = 150;
const currentPosition = new THREE.Vector3(0, 0, 35);
const minZoom = 50;
const maxZoom = 620;

const manager = WebGL.composables.useTopDownCamera({
    minZoom,
    maxZoom,
    currentZoom,
    currentPosition,
})

const options = {
    custom: manager.camera,
    rotation: {
        x: -60 * Math.PI / 180,
    },
}

export default {
    manager,
    options,
}
