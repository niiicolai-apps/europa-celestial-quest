import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getTexturePack, removeTexturePack, disposeTextureCache } from './textures.js';

const gltfLoader = new GLTFLoader();
const meshCache = {};
let meshesJson = null;

const applyTexturePacks = async (object3D, mesh) => {
    const subMeshData = []
    object3D.traverse((child) => {
        if (child.isMesh) {
            const subMesh = mesh.subMeshes.find(subMesh => subMesh.name === child.name);
            if (subMesh) {
                subMeshData.push({ subMesh, child });
            }
        }
    });

    for (const data of subMeshData) {
        const { subMesh, child } = data;
        const material = await getTexturePack(subMesh.texturePack, child.uuid);
        child.material = material;
    }
}

const createObject3D = async (name) => {
    if (!meshesJson) {
        const response = await fetch('./meshes/meshes.json');
        meshesJson = await response.json();
    }

    const data = meshesJson[name];

    let object3D = null;

    if (data.type === 'GLTF') {

        const gltf = await gltfLoader.loadAsync(data.url);
        object3D = gltf.scene;

    } else if (data.type === 'sphere') {

        const radius = data.radius || 1;
        const widthSegments = data.widthSegments || 32;
        const heightSegments = data.heightSegments || 32;
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        object3D = new THREE.Mesh(geometry);

    } else if (data.type === 'plane') {
        const width = data.width || 1;
        const height = data.height || 1;
        const geometry = new THREE.PlaneGeometry(width, height);
        object3D = new THREE.Mesh(geometry);

    } else {
        throw new Error(`Unknown mesh type: ${data.type}`);
    }

    object3D.castShadow = true;
    object3D.receiveShadow = true;
    object3D.userData.mesh = data;
    object3D.name = name;
    await applyTexturePacks(object3D, data);

    return { object3D, data };
}

const createCache = async (object3D, name, data, uuid) => {
    meshCache[name] = {
        mesh: object3D,
        data,
        clones: [uuid],
    }
}

const getCached = async (name) => {
    if (meshCache[name]) {
        const mesh = meshCache[name].mesh;
        const userData = mesh.userData;
        mesh.userData = {}
        const clone = mesh.clone();
        mesh.userData = userData;

        clone.traverse((child) => {
            if (child.name === 'healthBar') {
                child.parent.remove(child);
            }
        });

        clone.scale.set(1, 1, 1);
        clone.rotation.set(0, 0, 0);
        clone.position.set(0, 0, 0);

        await applyTexturePacks(clone, meshCache[name].data);
        meshCache[name].clones.push(clone.uuid);

        return clone;
    }

    return null;
}

export const getMesh = async (name) => {
    const cached = await getCached(name);
    if (cached) return cached;

    const { object3D, data } = await createObject3D(name);
    await createCache(object3D, name, data, object3D.uuid);

    return object3D;
}

export const removeMesh = async (object3D) => {
    const cached = meshCache[object3D.name];
    if (!cached) {
        return;
    }

    const index = cached.clones.indexOf(object3D.uuid);
    if (index === -1) return;
    cached.clones.splice(index, 1);

    // Remove child texture packs
    object3D.traverse(async (child) => {
        if (child.isMesh) {
            const subMesh = cached.data.subMeshes.find(subMesh => subMesh.name === child.name);
            if (!subMesh) return;
            removeTexturePack(subMesh.texturePack, child.uuid);
        }
    });

    if (cached.clones.length === 0) {
        delete meshCache[object3D.name];

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
