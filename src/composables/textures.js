import * as THREE from 'three'

let textureCache = {} 
const textureLoader = new THREE.TextureLoader()

const newMaterial = (type, color) => {
    let material;
    switch (type) {
        case 'MeshBasicMaterial':
            material = new THREE.MeshBasicMaterial({ color });
            break;
        case 'MeshPhysicalMaterial':
            material = new THREE.MeshPhysicalMaterial({ color });
            break;
        default:
            throw new Error(`Unknown material type: ${type}`);
    }
    return material;
}

const getCached = (name, object_uuid) => {
    if (textureCache[name]) {
        textureCache[name].clones.push(object_uuid)
        return textureCache[name].material;
    }

    return null;
}

export const getTexturePack = async (name, object_uuid) => {
    const cached = getCached(name, object_uuid)
    if (cached) return cached

    const texturesJson = await fetch('/textures/textures.json').then(res => res.json())
    const texturePack = texturesJson.find(texturePack => texturePack.name === name)
    if (!texturePack) return null

    const { material, textures } = texturePack
    const materialInstance = newMaterial(material, texturePack.color)
    materialInstance.colorSpace = THREE.SRGBColorSpace;
    materialInstance.transparent = texturePack.transparent
    materialInstance.opacity = texturePack.opacity || 1
    
    textures.map(async texture => {
        const { type, url } = texture
        const _texture = await textureLoader.loadAsync(url)
        _texture.wrapS = THREE.RepeatWrapping
        _texture.wrapT = THREE.RepeatWrapping
        _texture.repeat.set(1, 1)
        materialInstance[type] = _texture
    })

    const texture = {
        material: materialInstance,
        clones: [object_uuid],
    }

    textureCache[name] = texture

    return texture.material
}

export const removeTexturePack = (name, object_uuid) => {
    const cached = textureCache[name]
    if (!cached) return

    const index = cached.clones.indexOf(object_uuid)
    if (index === -1) return

    cached.clones.splice(index, 1)
    if (cached.clones.length === 0) {
        delete textureCache[name]

        const { material } = cached
        for (const key in material) {
            if (material[key] instanceof THREE.Texture) {
                material[key].dispose()
            }
        }
        material.dispose()
    }
}

export const disposeTextureCache = () => {
    for (const key in textureCache) {
        const { material } = textureCache[key]
        for (const key in material) {
            if (material[key] instanceof THREE.Texture) {
                material[key].dispose()
            }
        }
        material.dispose()
    }

    textureCache = {}
}
