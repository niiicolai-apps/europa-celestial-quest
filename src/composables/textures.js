import * as THREE from 'three'

const texturePacks = [
    {
        name: 'default',
        material: 'MeshBasicMaterial',
        color: 0x00ff00,
        transparent: false,
        textures: [
            //{ type: 'map', url: 'texture.png' },
        ]
    },
    {
        name: 'wood',
        material: 'MeshPhysicalMaterial',
        color: 0xffffff,
        transparent: false,
        textures: [
            { type: 'map', url: 'textures/wood/wood_basecolor.png' },
            { type: 'normalMap', url: 'textures/wood/wood_normal.png' },
        ]
    },
    {
        name: 'cardboard',
        material: 'MeshPhysicalMaterial',
        color: 0xffffff,
        transparent: false,
        textures: [
            { type: 'map', url: 'textures/cardboard/cardboard_basecolor.png' },
            { type: 'normalMap', url: 'textures/cardboard/cardboard_normal.png' },
        ]
    },
    {
        name: 'glass',
        material: 'MeshPhysicalMaterial',
        color: 0xffffff,
        opacity: 0.1,
        transparent: true,
        textures: []
    },
    {
        name: 'transparent_fabric',
        material: 'MeshPhysicalMaterial',
        color: 0xffffff,
        opacity: 0.5,
        transparent: true,
        textures: []
    },
    {
        name: 'red_fabric',
        material: 'MeshPhysicalMaterial',
        color: 0xffffff,
        opacity: 1,
        transparent: false,
        textures: [
            { type: 'map', url: 'textures/red_fabric/red_fabric_basecolor.png' },
            { type: 'normalMap', url: 'textures/red_fabric/red_fabric_normal.png'}
        ]
    },
    {
        name: 'black_fabric',
        material: 'MeshPhysicalMaterial',
        color: 0xffffff,
        opacity: 1,
        transparent: false,
        textures: [
            { type: 'map', url: 'textures/black_fabric/black_fabric_basecolor.png' },
            { type: 'normalMap', url: 'textures/black_fabric/black_fabric_normal.png'}
        ]
    },
    {
        name: 'blue_fabric',
        material: 'MeshPhysicalMaterial',
        color: 0xffffff,
        opacity: 1,
        transparent: false,
        textures: [
            { type: 'map', url: 'textures/blue_fabric/blue_fabric_basecolor.png' },
            { type: 'normalMap', url: 'textures/blue_fabric/blue_fabric_normal.png'}
        ]
    },
    {
        name: 'blue',
        material: 'MeshPhysicalMaterial',
        color: 0x0000ff,
        transparent: false,
        textures: []
    },
    {
        name: 'book_paper',
        material: 'MeshPhysicalMaterial',
        color: 0xffffff,
        transparent: false,
        textures: [
            { type: 'map', url: 'textures/book_paper/book_paper_basecolor.png' },
            { type: 'normalMap', url: 'textures/book_paper/book_paper_normal.png' },
        ]
    },
    {
        name: 'terrain',
        material: 'MeshPhysicalMaterial',
        color: 0xffffff,
        transparent: false,
        textures: [
            { type: 'map', url: 'textures/terrain/terrain_basecolor.png' },
        ]
    }
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
