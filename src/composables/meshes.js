import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { getTexturePack } from './textures.js';

const gltfLoader = new GLTFExporter();
const meshCache = {};

const getCached = (name) => {
    if (meshCache[name]) {
        const clone = meshCache[name].mesh.clone()
        meshCache[name].clones.push(clone);
        return clone;
    }

    return null;
}

export const getMesh = async (mesh) => {
    const cached = getCached(mesh.name);
    if (cached) return cached;

    let object3D = null;
    if (mesh.type === 'BoxGeometry') {
        const subMesh = mesh.subMeshes[0];
        const { width, height, depth } = subMesh;
        const geometry = new THREE.BoxGeometry(width, height, depth);
        object3D = new THREE.Mesh(geometry);
        const material = await getTexturePack(subMesh.texturePack, object3D.uuid);
        object3D.material = material;
    } else if (mesh.type === 'GLTF') {
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

    meshCache[mesh.name] = meshInstance;
    return meshInstance.mesh;
}
