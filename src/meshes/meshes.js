
export default {
    terrain: {
        name: 'terrain',
        type: 'GLTF',
        url: 'meshes/utils/terrain.glb',
        subMeshes: [{
            name: 'map',
            texturePack: 'terrain',
        }],
    },
    womans_house: {
        name: 'womans_house',
        type: 'GLTF',
        url: 'meshes/utils/womans_house.glb',
        subMeshes: [{
            name: 'Wood',
            texturePack: 'wood',
        }, {
            name: 'Carboard',
            texturePack: 'cardboard',
        }, {
            name: 'Cube051',
            texturePack: 'glass',
        }, {
            name: 'Plane003',
            texturePack: 'transparent_fabric',
        }, {
            name: 'Plane002',
            texturePack: 'red_fabric'
        }, {
            name: 'Cube099',
            texturePack: 'black_fabric'
        }, {
            name: 'Cube095',
            texturePack: 'book_paper'
        }, {
            name: 'Cube056',
            texturePack: 'book_paper'
        }],
    },
    woman_with_poem: {
        name: 'woman_with_poem',
        type: 'GLTF',
        url: "meshes/utils/woman_with_poem.glb",
        subMeshes: [{
            name: 'Cube105',
            texturePack: 'blue_fabric',
        }, {
            name: 'Cube104',
            texturePack: 'blue_fabric',
        }, {
            name: 'Cube106',
            texturePack: 'blue_fabric',
        }],
    },
    jupiter: {
        name: 'jupiter',
        type: 'GLTF',
        url: 'meshes/utils/jupiter.glb',
        subMeshes: [],
    },
    europa: {
        name: 'europa',
        type: 'GLTF',
        url: 'meshes/utils/europa.glb',
        subMeshes: [],
    },
    europa_horizon_drifter_x1: {
        name: 'europa_horizon_drifter_x1',
        type: 'GLTF',
        url: 'meshes/human_construction/europa_horizon_drifter_x1.glb',
        subMeshes: [],
    },
}
