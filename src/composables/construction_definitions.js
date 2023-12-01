export default [
    {
        name: 'Europa Horizon Drifter X1',
        image: 'thumbnails/human_construction/europa_horizon_drifter_x1.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/europa_horizon_drifter_x1.glb',
            subMeshes: [
                {
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Robot Facility',
        image: 'thumbnails/human_construction/bot_builder.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/bot_builder.glb',
            subMeshes: [
                {
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [{
            name: 'Upgrade 1',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [{
                name: 'B S-1',
                image: 'thumbnails/human_units/bot_spider_1.png',
                requiredLevel: 1,
                mesh: {
                    type: 'GLTF',
                    url: 'meshes/human_units/bot_spider_1.glb',
                    subMeshes: [
                        {
                            name: 'Cube',
                            texturePack: 'default',
                        },
                    ]
                },
            }]
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [
                {
                    name: 'B S-2',
                    image: 'thumbnails/human_units/bot_spider_2.png',
                    requiredLevel: 1,
                    mesh: {
                        type: 'GLTF',
                        url: 'meshes/human_units/bot_spider_2.glb',
                        subMeshes: [
                            {
                                name: 'Cube',
                                texturePack: 'default',
                            },
                        ]
                    },
                }
            ]
        }],
    },
    {
        name: 'Drone Facility',
        image: 'thumbnails/human_construction/drone_builder.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/drone_builder.glb',
            subMeshes: [
                {
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [{
            name: 'Upgrade 1',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [
                {
                    name: 'D L-1',
                    image: 'thumbnails/human_units/drone_laser_1.png',
                    requiredLevel: 1,
                    mesh: {
                        type: 'GLTF',
                        url: 'meshes/human_units/drone_laser_1.glb',
                        subMeshes: [
                            {
                                name: 'Cube',
                                texturePack: 'default',
                            },
                        ]
                    },
                }
            ]
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [
                {
                    name: 'D L-2',
                    image: 'thumbnails/human_units/drone_laser_2.png',
                    requiredLevel: 1,
                    mesh: {
                        type: 'GLTF',
                        url: 'meshes/human_units/drone_laser_2.glb',
                        subMeshes: [
                            {
                                name: 'Cube',
                                texturePack: 'default',
                            },
                        ]
                    },
                }
            ]
        }],
    },
    {
        name: 'Hydrogen Fuel Tank',
        image: 'thumbnails/human_construction/hydrogen_fuel_tank.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/hydrogen_fuel_tank.glb',
            subMeshes: [
                {
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Rock Metal Extractor',
        image: 'thumbnails/human_construction/rock_metal_extractor.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/rock_metal_extractor.glb',
            subMeshes: [
                {
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Rover Research Facility',
        image: 'thumbnails/human_construction/rover_research_facility.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/rover_research_facility.glb',
            subMeshes: [
                {
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [{
            name: 'Upgrade 1',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [{
                name: 'RR H20',
                image: 'thumbnails/human_units/rover_research_h20.png',
                requiredLevel: 1,
                mesh: {
                    type: 'GLTF',
                    url: 'meshes/human_units/rover_research_h20.glb',
                    subMeshes: [
                        {
                            name: 'Cube',
                            texturePack: 'default',
                        },
                    ]
                },
            }]
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [
                {
                    name: 'RR D-1',
                    image: 'thumbnails/human_units/rover_research_d1.png',
                    requiredLevel: 1,
                    mesh: {
                        type: 'GLTF',
                        url: 'meshes/human_units/rover_research_d1.glb',
                        subMeshes: [
                            {
                                name: 'Cube',
                                texturePack: 'default',
                            },
                        ]
                    },
                }
            ]
        }],
    },
    {
        name: 'Rover Warrior Facility',
        image: 'thumbnails/human_construction/rover_warrior_facility.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/rover_warrior_facility.glb',
            subMeshes: [
                {
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [{
            name: 'Upgrade 1',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [{
                name: 'RR W-3',
                image: 'thumbnails/human_units/rover_warrior_6.png',
                requiredLevel: 1,
                mesh: {
                    type: 'GLTF',
                    url: 'meshes/human_units/rover_warrior_6.glb',
                    subMeshes: [
                        {
                            name: 'Cube',
                            texturePack: 'default',
                        },
                    ]
                },
            }]
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [
                {
                    name: 'RR W-6',
                    image: 'thumbnails/human_units/rover_warrior_3.png',
                    requiredLevel: 1,
                    mesh: {
                        type: 'GLTF',
                        url: 'meshes/human_units/rover_warrior_3.glb',
                        subMeshes: [
                            {
                                name: 'Cube',
                                texturePack: 'default',
                            },
                        ]
                    },
                }
            ]
        }],
    },
    {
        name: 'Machine Gun Turrent',
        image: 'thumbnails/human_construction/machine_gun_turrent.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/machine_gun_turrent.glb',
            subMeshes: [
                {
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [],
    },
    {
        name: 'Solar Panel',
        image: 'thumbnails/human_construction/solar_panel.png',
        requiredLevel: 1,
        mesh: {
            type: 'GLTF',
            url: 'meshes/human_construction/solar_panel.glb',
            subMeshes: [
                {
                    name: 'Cube',
                    texturePack: 'default',
                },
            ]
        },
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
        upgrade: { index: 0 },
        upgrades: [
            {
                name: 'Upgrade 1',
                costs: [
                    { currency: "coins", amount: 1 },
                    { currency: "diamonds", amount: 0 },
                ],
                subMesh: {
                    name: 'Solar_Panel_Level_1',
                },
            },
            {
                name: 'Upgrade 2',
                costs: [
                    { currency: "coins", amount: 1 },
                    { currency: "diamonds", amount: 0 },
                ],
                subMesh: {
                    name: 'Solar_Panel_Level_2',
                },
            },
            {
                name: 'Upgrade 3',
                costs: [
                    { currency: "coins", amount: 1 },
                    { currency: "diamonds", amount: 0 },
                ],
                subMesh: {
                    name: 'Solar_Panel_Level_3',
                },
            },
        ],
    }
]
