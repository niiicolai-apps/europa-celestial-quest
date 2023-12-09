import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getTexturePack, removeTexturePack, disposeTextureCache } from './textures.js';

const gltfLoader = new GLTFLoader();
const meshCache = {};

const getCached = (url) => {
    if (meshCache[url]) {
        const mesh = meshCache[url].mesh;
        const userData = mesh.userData;
        mesh.userData = {}
        const clone = mesh.clone();
        mesh.userData = userData;
        meshCache[url].clones.push(clone);
        return clone;
    }

    return null;
}

export const getMesh = async (mesh) => {
    const cached = getCached(mesh.url);
    if (cached) return cached;

    let object3D = null;
    if (mesh.type === 'GLTF') {
        const gltf = await gltfLoader.loadAsync(mesh.url);
        object3D = gltf.scene;

        // Apply texture packs
        object3D.traverse(async (child) => {
            if (child.isMesh) {
                if (child.name === 'Cube051' || child.name === 'Cube060') child.visible = false;
                child.castShadow = true;
                child.receiveShadow = true;
                const subMesh = mesh.subMeshes.find(subMesh => subMesh.name === child.name);
                if (!subMesh) return;

                const material = await getTexturePack(subMesh.texturePack, child.uuid);
                child.material = material;
            }
        });
    } else {
        throw new Error(`Unknown mesh type: ${mesh.type}`);
    }
    object3D.userData.mesh = mesh;
    const meshInstance = {
        mesh: object3D,
        clones: [object3D.uuid],
    }

    meshCache[mesh.url] = meshInstance;
    return meshInstance.mesh;
}

export const removeMesh = (object3D) => {
    const mesh = object3D.userData.mesh;
    if (!mesh || !mesh.url) {
        console.log('bug: mesh or mesh.url is undefined')
        return;
    }
    const cached = meshCache[mesh.url];
    if (!cached) return;

    const index = cached.clones.indexOf(object3D.uuid);
    if (index === -1) return;
    cached.clones.splice(index, 1);
    
    // Remove child texture packs
    object3D.traverse(async (child) => {
        if (child.isMesh) {
            const subMesh = mesh.subMeshes.find(subMesh => subMesh.name === child.name);
            if (!subMesh) return;
            removeTexturePack(subMesh.texturePack, child.uuid);
        }
    });
    
    if (cached.clones.length === 0) {
        delete meshCache[mesh.url];

        // dispose geometry
        object3D.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();
            }
        });
    }
}

export const disposeMeshCache = () => {
    /*
    for (const key in meshCache) {
        const meshInstance = meshCache[key];
        for (const clone of meshInstance.clones) {
            removeMesh(clone);
        }
    }*/
    disposeTextureCache();
}
