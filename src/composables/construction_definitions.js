import meshesJson from '../meshes/meshes.json'

const FEATURES = {
    MISSILE_ATTACK: (distance = 5, rate = 2, damage = 15) => {
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
    MACHINE_GUN_ATTACK: (distance = 5, rate = 2, damage = 15) => {
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
    LASER_ATTACK: (distance = 5, rate = 2, damage = 15) => {
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
    MOVE: (speed = 0.1, type = 'walk', groundOffset = 1) => {
        return {
            name: 'move',
            options: {
                type,
                speed,
                groundOffset
            }
        }
    },
    HEALTH: (maxHealth = 100) => {
        return {
            name: 'health',
            options: {
                health: maxHealth,
                maxHealth,
            }
        }
    },
    COLLECT: (type = 'rock', costs=[{ currency: "power", amount: 1 }], max = 1, speed = 5000, deliver_construction = 'Hydrogen Fuel Tank') => {
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
                costs,
            }
        }
    },
    STORAGE: (type = 'rock', max = 100) => {
        return {
            name: 'storage',
            options: {
                type,
                max,
            }
        }
    },
    PRODUCE: (type = 'hydrogen', costs=[], rate = 1, speed = 5000) => {
        return {
            name: 'produce',
            options: {
                nextTime: 0,
                type,
                rate,
                speed,
                costs,
            }
        }
    },
    SCAN: (type = 'research', costs=[{ currency: "power", amount: 1 }], rate = 0.1, speed = 5000, deliver_construction = 'Europa Horizon Drifter X1') => {
        return {
            name: 'scan',
            options: {
                next_position: null,
                deliver_to: null,
                scanned: false,
                type,
                rate,
                speed,
                costs,
                deliver_construction
            }
        }
    },
}

const PRIMARY_FUNCTIONS = {
    COLLECTOR: 'collector',
    WARRIOR: 'warrior',
    SCANNER: 'scanner',
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
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
            { currency: "power", amount: 1 }
        ],
        mesh: meshesJson['B S-1'],
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
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
            { currency: "power", amount: 1 }
        ],
        mesh: meshesJson['B S-2'],
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
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
            { currency: "power", amount: 1 }
        ],
        mesh: meshesJson['D L-1'],
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
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
            { currency: "power", amount: 1 }
        ],
        mesh: meshesJson['D L-2'],
    },
    ROVER_RESEARCH_H20: {
        name: 'RR H20',
        image: 'thumbnails/human_units/rover_research_h20.png',
        requiredLevel: 1,
        complete_time: 1000,
        primary_function: PRIMARY_FUNCTIONS.COLLECTOR,
        features: [
            FEATURES.COLLECT("ice", [{ currency: "power", amount: 1 }], 1, 5000, "Hydrogen Fuel Tank"),
            FEATURES.MOVE(),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
            { currency: "power", amount: 1 }
        ],
        mesh: meshesJson['RR H20'],
    },
    ROVER_RESEARCH_D1: {
        name: 'RR D-1',
        image: 'thumbnails/human_units/rover_research_d1.png',
        requiredLevel: 1,
        complete_time: 1000,
        primary_function: PRIMARY_FUNCTIONS.COLLECTOR,
        features: [
            FEATURES.COLLECT("rock", [{ currency: "power", amount: 1 }], 1, 5000, "Rock Metal Extractor"),
            FEATURES.MOVE(),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
            { currency: "power", amount: 1 }
        ],
        mesh: meshesJson['RR D-1'],
    },
    ROVER_RESEARCH_S1: {
        name: 'RR S-1',
        image: 'thumbnails/human_units/rover_research_d1.png',
        requiredLevel: 1,
        complete_time: 1000,
        primary_function: PRIMARY_FUNCTIONS.SCANNER,
        features: [
            FEATURES.MOVE(),
            FEATURES.HEALTH(),
            FEATURES.SCAN(),
        ],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
            { currency: "power", amount: 1 }
        ],
        mesh: meshesJson['RR S-1'],
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
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
            { currency: "power", amount: 1 }
        ],
        mesh: meshesJson['RR W-3'],
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
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
            { currency: "power", amount: 1 }
        ],
        mesh: meshesJson['RR W-6'],
    }
}

export default [
    {
        name: 'Europa Horizon Drifter X1',
        image: 'thumbnails/human_construction/europa_horizon_drifter_x1.png',
        requiredLevel: 1,
        mesh: meshesJson['europa_horizon_drifter_x1'],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
        ],
        upgrade: { index: 0 },
        upgrades: [{
            name: 'Upgrade 1',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            features: [
                FEATURES.HEALTH(),
                FEATURES.PRODUCE('power', [], 2, 5000),
            ],
        }],
    },
    {
        name: 'Robot Facility',
        image: 'thumbnails/human_construction/bot_builder.png',
        requiredLevel: 1,
        mesh: meshesJson['Robot Facility'],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
        ],
        upgrade: { index: 0 },
        upgrades: [{
            name: 'Upgrade 1',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [UNITS.BOT_SPIDER_1],
            features: [
                FEATURES.HEALTH(),
            ],
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [UNITS.BOT_SPIDER_2],
            features: [
                FEATURES.HEALTH(),
            ],
        }],
    },
    {
        name: 'Drone Facility',
        image: 'thumbnails/human_construction/drone_builder.png',
        requiredLevel: 1,
        mesh: meshesJson['Drone Facility'],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
        ],
        upgrade: { index: 0 },
        upgrades: [{
            name: 'Upgrade 1',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [UNITS.DRONE_LASER_1],
            features: [
                FEATURES.HEALTH(),
            ],
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [UNITS.DRONE_LASER_2],
            features: [
                FEATURES.HEALTH(),
            ],
        }],
    },
    {
        name: 'Hydrogen Fuel Tank',
        image: 'thumbnails/human_construction/hydrogen_fuel_tank.png',
        requiredLevel: 1,
        mesh: meshesJson['Hydrogen Fuel Tank'],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
        ],
        upgrade: { index: 0 },
        upgrades: [{
            name: 'Upgrade 1',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [],
            features: [
                FEATURES.STORAGE('ice', 100),
                FEATURES.STORAGE('hydrogen', 100),
                FEATURES.PRODUCE('hydrogen', [{ currency: "ice", amount: 10 }, { currency: "power", amount: 10 }], 10, 5000),
                FEATURES.HEALTH(),
            ],
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [],
            features: [
                FEATURES.STORAGE('ice', 500),
                FEATURES.STORAGE('hydrogen', 500),
                FEATURES.PRODUCE('hydrogen', [{ currency: "ice", amount: 10 }, { currency: "power", amount: 10 }], 20, 5000),
                FEATURES.HEALTH(),
            ],
        }],
    },
    {
        name: 'Rock Metal Extractor',
        image: 'thumbnails/human_construction/rock_metal_extractor.png',
        requiredLevel: 1,
        mesh: meshesJson['Rock Metal Extractor'],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
        ],
        upgrade: { index: 0 },
        upgrades: [{
            name: 'Upgrade 1',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [],
            features: [
                FEATURES.STORAGE('rock', 100),
                FEATURES.STORAGE('metal', 100),
                FEATURES.PRODUCE('metal', [{ currency: "rock", amount: 10 }, { currency: "power", amount: 10 }], 10, 5000),
                FEATURES.HEALTH(),
            ],
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [],
            features: [
                FEATURES.STORAGE('rock', 500),
                FEATURES.STORAGE('metal', 500),
                FEATURES.PRODUCE('metal', [{ currency: "rock", amount: 10 }, { currency: "power", amount: 10 }], 20, 5000),
                FEATURES.HEALTH(),
            ],
        }],
    },
    {
        name: 'Rover Research Facility',
        image: 'thumbnails/human_construction/rover_research_facility.png',
        requiredLevel: 1,
        mesh: meshesJson['Rover Research Facility'],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
        ],
        upgrade: { index: 0 },
        upgrades: [{
            name: 'Upgrade 1',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [
                UNITS.ROVER_RESEARCH_H20,
                UNITS.ROVER_RESEARCH_S1,
            ],
            features: [
                FEATURES.HEALTH(),
            ],
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [UNITS.ROVER_RESEARCH_D1],
            features: [
                FEATURES.HEALTH(),
            ],
        }],
    },
    {
        name: 'Rover Warrior Facility',
        image: 'thumbnails/human_construction/rover_warrior_facility.png',
        requiredLevel: 1,
        mesh: meshesJson['Rover Warrior Facility'],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
        ],
        upgrade: { index: 0 },
        upgrades: [{
            name: 'Upgrade 1',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [UNITS.ROVER_WARRIOR_3],
            features: [
                FEATURES.HEALTH(),
            ],
        }, {
            name: 'Upgrade 2',
            costs: [
                { currency: "metal", amount: 0 },
                { currency: "rock", amount: 1 },
                { currency: "hydrogen", amount: 0 },
                { currency: "ice", amount: 1 },
            ],
            subMesh: {},
            units: [UNITS.ROVER_WARRIOR_6],
            features: [
                FEATURES.HEALTH(),
            ],
        }],
    },
    {
        name: 'Machine Gun Turrent',
        image: 'thumbnails/human_construction/machine_gun_turrent.png',
        requiredLevel: 1,
        mesh: meshesJson['Machine Gun Turrent'],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
        ],
        upgrade: { index: 0 },
        upgrades: [
            {
                name: 'Upgrade 1',
                costs: [
                    { currency: "metal", amount: 0 },
                    { currency: "rock", amount: 1 },
                    { currency: "hydrogen", amount: 0 },
                    { currency: "ice", amount: 1 },
                ],
                subMesh: {
                    name: 'Machine_Gun_Turrent_Level_1',
                },
                features: [
                    FEATURES.MACHINE_GUN_ATTACK(),
                    FEATURES.HEALTH(),
                ],
            },
            {
                name: 'Upgrade 2',
                costs: [
                    { currency: "metal", amount: 0 },
                    { currency: "rock", amount: 1 },
                    { currency: "hydrogen", amount: 0 },
                    { currency: "ice", amount: 1 },
                ],
                subMesh: {
                    name: 'Machine_Gun_Turrent_Level_2',
                },
                features: [
                    FEATURES.MACHINE_GUN_ATTACK(),
                    FEATURES.HEALTH(),
                ],
            },
            {
                name: 'Upgrade 3',
                costs: [
                    { currency: "metal", amount: 0 },
                    { currency: "rock", amount: 1 },
                    { currency: "hydrogen", amount: 0 },
                    { currency: "ice", amount: 1 },
                ],
                subMesh: {
                    name: 'Machine_Gun_Turrent_Level_3',
                },
                features: [
                    FEATURES.MACHINE_GUN_ATTACK(),
                    FEATURES.HEALTH(),
                ],
            },
        ],
    },
    {
        name: 'Solar Panel',
        image: 'thumbnails/human_construction/solar_panel.png',
        requiredLevel: 1,
        mesh: meshesJson['Solar Panel'],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "rock", amount: 1 },
            { currency: "hydrogen", amount: 0 },
            { currency: "ice", amount: 1 },
        ],
        upgrade: { index: 0 },
        upgrades: [
            {
                name: 'Upgrade 1',
                costs: [
                    { currency: "metal", amount: 0 },
                    { currency: "rock", amount: 1 },
                    { currency: "hydrogen", amount: 0 },
                    { currency: "ice", amount: 1 },
                ],
                subMesh: {
                    name: 'Solar_Panel_Level_1',
                },
                features: [
                    FEATURES.STORAGE('power', 100),
                    FEATURES.PRODUCE('power', [], 10, 5000),
                    FEATURES.HEALTH(),
                ],
            },
            {
                name: 'Upgrade 2',
                costs: [
                    { currency: "metal", amount: 0 },
                    { currency: "rock", amount: 1 },
                    { currency: "hydrogen", amount: 0 },
                    { currency: "ice", amount: 1 },
                ],
                subMesh: {
                    name: 'Solar_Panel_Level_2',
                },
                features: [
                    FEATURES.STORAGE('power', 200),
                    FEATURES.PRODUCE('power', [], 20, 5000),
                    FEATURES.HEALTH(),
                ],
            },
            {
                name: 'Upgrade 3',
                costs: [
                    { currency: "metal", amount: 0 },
                    { currency: "rock", amount: 1 },
                    { currency: "hydrogen", amount: 0 },
                    { currency: "ice", amount: 1 },
                ],
                subMesh: {
                    name: 'Solar_Panel_Level_3',
                },
                features: [
                    FEATURES.STORAGE('power', 300),
                    FEATURES.PRODUCE('power', [], 30, 5000),
                    FEATURES.HEALTH(),
                ],
            },
        ],
    }
]
