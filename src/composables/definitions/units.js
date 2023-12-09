import FEATURES from './features.js'
import PRIMARY_FUNCTIONS from './primary_functions.js'
import meshesJson from '../../meshes/meshes.json'

const UNIT_PRIMARY_FUNCTIONS = PRIMARY_FUNCTIONS.UNITS;

const UNITS = {
    BOT_SPIDER_1: {
        name: 'B S-1',
        image: 'thumbnails/human_units/bot_spider_1.png',
        requiredLevel: 1,
        complete_time: 1000,
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
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
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
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
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
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
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
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
        primary_function: UNIT_PRIMARY_FUNCTIONS.COLLECTOR,
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
        primary_function: UNIT_PRIMARY_FUNCTIONS.COLLECTOR,
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
        primary_function: UNIT_PRIMARY_FUNCTIONS.SCANNER,
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
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
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
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
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

export default UNITS
