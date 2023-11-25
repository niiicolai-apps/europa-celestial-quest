import * as THREE from 'three'

const texturePacks = [
    {
        name: 'default',
        material: 'MeshBasicMaterial',
        color: 0x00ff00,
        textures: [
            //{ type: 'map', url: 'texture.png' },
        ]
    },
]

const textureCache = {}
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

    const texturePack = texturePacks.find(texturePack => texturePack.name === name)
    if (!texturePack) return null

    const { material, textures } = texturePack
    const materialInstance = newMaterial(material, texturePack.color)
    console.log(materialInstance);
    textures.map(async texture => {
        const { type, url } = texture
        const _texture = await textureLoader.loadAsync(url)
        materialInstance[type] = _texture
    })

    const texture = {
        material: materialInstance,
        clones: [object_uuid],
    }

    textureCache[name] = texture
    console.log(texture);
    return texture.material
}
