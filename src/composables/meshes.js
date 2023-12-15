import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getTexturePack, removeTexturePack, disposeTextureCache } from './textures.js';
import { ref } from 'vue';

const gltfLoader = new GLTFLoader();
const meshCache = {};
let meshesJson = null;

const getCached = (name) => {
    if (meshCache[name]) {
        const mesh = meshCache[name].mesh;
        const userData = mesh.userData;
        mesh.userData = {}
        const clone = mesh.clone();
        clone.traverse((child) => {
            if (child.name === 'healthBar') {
                child.parent.remove(child);
            }
        });
        mesh.userData = userData;
        meshCache[name].clones.push(clone);
        return clone;
    }

    return null;
}

export const getMesh = async (name) => {
    const cached = getCached(name);
    if (cached) return cached;
    if (!meshesJson) 
        meshesJson = await fetch('/meshes/meshes.json').then(res => res.json());

    const mesh = meshesJson[name];

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
                if (subMesh) {
                    const material = await getTexturePack(subMesh.texturePack, child.uuid);
                    child.material = material;
                }
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

    meshCache[name] = meshInstance;
    return meshInstance.mesh;
}

export const removeMesh = async (object3D) => {
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

export const disposeMeshCache = async () => {
    
    for (const key in meshCache) {
        const meshInstance = meshCache[key];
        for (const clone of meshInstance.clones) {
            await removeMesh(clone);
        }
    }
    disposeTextureCache();
}
