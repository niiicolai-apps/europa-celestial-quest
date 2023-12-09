import FEATURES from './features.js'
import PRIMARY_FUNCTIONS from './primary_functions.js'
import UNITS from './units.js'
import meshesJson from '../../meshes/meshes.json'

const CONSTRUCTION_PRIMARY_FUNCTIONS = PRIMARY_FUNCTIONS.CONSTRUCTIONS;

const CONSTRUCTIONS = [
    {
        name: 'Europa Horizon Drifter X1',
        primary_function: CONSTRUCTION_PRIMARY_FUNCTIONS.BASE,
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
        primary_function: CONSTRUCTION_PRIMARY_FUNCTIONS.SPAWNER,
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
        primary_function: CONSTRUCTION_PRIMARY_FUNCTIONS.SPAWNER,
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
        primary_function: CONSTRUCTION_PRIMARY_FUNCTIONS.PRODUCER,
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
        primary_function: CONSTRUCTION_PRIMARY_FUNCTIONS.PRODUCER,
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
        primary_function: CONSTRUCTION_PRIMARY_FUNCTIONS.SPAWNER,
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
        primary_function: CONSTRUCTION_PRIMARY_FUNCTIONS.SPAWNER,
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
        primary_function: CONSTRUCTION_PRIMARY_FUNCTIONS.TOWER,
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
        primary_function: CONSTRUCTION_PRIMARY_FUNCTIONS.PRODUCER,
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

export default CONSTRUCTIONS
