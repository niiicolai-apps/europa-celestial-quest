const FEATURES = {
    MISSILE_ATTACK: (distance=5, rate=2, damage=15) => {
        return { 
            name: 'attack',
            options: {
                type: 'missile',
                distance,
                rate,
                damage,
            }
        }
    },
    MACHINE_GUN_ATTACK: (distance=5, rate=2, damage=15) => {
        return { 
            name: 'attack',
            options: {
                type: 'machine_gun',
                distance,
                rate,
                damage,
            }
        }
    },
    LASER_ATTACK: (distance=5, rate=2, damage=15) => {
        return { 
            name: 'attack',
            options: {
                type: 'laser',
                distance,
                rate,
                damage,
            }
        }
    },
    MOVE: (speed=0.1, type='walk', groundOffset=1) => {
        return { 
            name: 'move',
            options: {
                type,
                speed,
                groundOffset
            }
        }
    },
    HEALTH: (maxHealth=100) => {
        return { 
            name: 'health',
            options: {
                health: maxHealth,
                maxHealth,
            }
        }
    },
    COLLECT: (type='rock', max=1, speed=5000, deliver_construction='Hydrogen Fuel Tank') => {
        return { 
            name: 'collect',
            options: {
                collected: 0,
                resource: null,
                deliver_to: null,
                type,
                max,
                speed,
                deliver_construction,
            }
        }
    },
}

const PRIMARY_FUNCTIONS = {
    COLLECTOR: 'collector',
    WARRIOR: 'warrior',
}

const UNITS = {
    BOT_SPIDER_1: {
        name: 'B S-1',
        image: 'thumbnails/human_units/bot_spider_1.png',
        requiredLevel: 1,
        complete_time: 1000,
        primary_function: PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.MISSILE_ATTACK(),
            FEATURES.MOVE(),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
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
    },
    BOT_SPIDER_2: {
        name: 'B S-2',
        image: 'thumbnails/human_units/bot_spider_2.png',
        requiredLevel: 1,
        complete_time: 1000,
        primary_function: PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.MISSILE_ATTACK(),
            FEATURES.MOVE(),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
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
    },
    DRONE_LASER_1: {
        name: 'D L-1',
        image: 'thumbnails/human_units/drone_laser_1.png',
        requiredLevel: 1,
        complete_time: 1000,
        primary_function: PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.LASER_ATTACK(),
            FEATURES.MOVE(),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
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
    },
    DRONE_LASER_2: {
        name: 'D L-2',
        image: 'thumbnails/human_units/drone_laser_2.png',
        requiredLevel: 1,
        complete_time: 1000,
        primary_function: PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.LASER_ATTACK(),
            FEATURES.MOVE(),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
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
    },
    ROVER_RESEARCH_H20: {
        name: 'RR H20',
        image: 'thumbnails/human_units/rover_research_h20.png',
        requiredLevel: 1,
        complete_time: 1000,
        primary_function: PRIMARY_FUNCTIONS.COLLECTOR,
        features: [
            FEATURES.COLLECT("ice", 1, 5000, "Hydrogen Fuel Tank"),
            FEATURES.MOVE(),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
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
    },
    ROVER_RESEARCH_D1: {
        name: 'RR D-1',
        image: 'thumbnails/human_units/rover_research_d1.png',
        requiredLevel: 1,
        complete_time: 1000,
        primary_function: PRIMARY_FUNCTIONS.COLLECTOR,
        features: [
            FEATURES.COLLECT("rock", 1, 5000, "Rock Metal Extractor"),
            FEATURES.MOVE(),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
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
    },
    ROVER_WARRIOR_3: {
        name: 'RR W-3',
        image: 'thumbnails/human_units/rover_warrior_6.png',
        requiredLevel: 1,
        complete_time: 1000,
        primary_function: PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.MACHINE_GUN_ATTACK(),
            FEATURES.MOVE(),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ],
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
    },
    ROVER_WARRIOR_6: {
        name: 'RR W-6',
        image: 'thumbnails/human_units/rover_warrior_3.png',
        complete_time: 1000,
        requiredLevel: 1,
        primary_function: PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.MACHINE_GUN_ATTACK(),
            FEATURES.MOVE(),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "coins", amount: 1 },
            { currency: "diamonds", amount: 0 },
        ], 
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
}

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
            units: [UNITS.BOT_SPIDER_1]
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [UNITS.BOT_SPIDER_2]
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
            units: [UNITS.DRONE_LASER_1]
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [UNITS.DRONE_LASER_2]
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
            units: [UNITS.ROVER_RESEARCH_H20]
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [UNITS.ROVER_RESEARCH_D1]
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
            units: [UNITS.ROVER_WARRIOR_3]
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "coins", amount: 1 },
                { currency: "diamonds", amount: 0 },
            ],
            subMesh: {},
            units: [UNITS.ROVER_WARRIOR_6]
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
