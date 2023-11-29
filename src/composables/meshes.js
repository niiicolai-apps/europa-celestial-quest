import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getTexturePack } from './textures.js';

const gltfLoader = new GLTFLoader();
const meshCache = {};

const getCached = (url) => {
    if (meshCache[url]) {
        const clone = meshCache[url].mesh.clone()
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
        object3D.traverse(async (child) => {
            if (child.isMesh) {
                const subMesh = mesh.subMeshes.find(subMesh => subMesh.name === child.name);
                if (!subMesh) return;

                const material = await getTexturePack(subMesh.texturePack, child.uuid);
                child.material = material;
            }
        });
    } else {
        throw new Error(`Unknown mesh type: ${mesh.type}`);
    }
    
    console.log(object3D);
    const meshInstance = {
        mesh: object3D,
        clones: [mesh.uuid],
    }

    meshCache[mesh.url] = meshInstance;
    return meshInstance.mesh;
}
