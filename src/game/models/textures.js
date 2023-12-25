import * as THREE from 'three'

let textureCache = {}
let textureJson = null
const textureLoader = new THREE.TextureLoader()

const newMaterial = (type) => {
    let material;
    switch (type) {
        case 'MeshBasicMaterial':
            material = new THREE.MeshBasicMaterial();
            break;
        case 'MeshPhysicalMaterial':
            material = new THREE.MeshPhysicalMaterial();
            break;
        case 'MeshPhongMaterial':
            material = new THREE.MeshPhongMaterial();
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

    if (!textureJson)
        textureJson = await fetch('./textures/textures.json').then(res => res.json())

    const texturePack = textureJson.find(texturePack => texturePack.name === name)
    if (!texturePack) return null

    const { material, textures } = texturePack
    const materialInstance = newMaterial(material)
    materialInstance.colorSpace = THREE.SRGBColorSpace;
    materialInstance.transparent = texturePack.transparent
    materialInstance.opacity = texturePack.opacity || 1

    if (materialInstance.emissive && texturePack.emissive) {
        if (texturePack.emissive.name === 'red')
            materialInstance.emissive = new THREE.Color(0xff0000);
        else
            materialInstance.emissive = new THREE.Color(
                texturePack.emissive.r,
                texturePack.emissive.g,
                texturePack.emissive.b
            )
    }

    if (materialInstance.color && texturePack.color) {
        if (texturePack.color.name === 'red')
            materialInstance.color = new THREE.Color(0xff0000);
        else
            materialInstance.color = new THREE.Color(
                texturePack.color.r,
                texturePack.color.g,
                texturePack.color.b
            )
    }

    for (const texture of textures) {
        const { type, url } = texture
        const _texture = await textureLoader.loadAsync(url)
        _texture.wrapS = THREE.RepeatWrapping
        _texture.wrapT = THREE.RepeatWrapping
        _texture.repeat.set(1, 1)
        materialInstance[type] = _texture
    }

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
