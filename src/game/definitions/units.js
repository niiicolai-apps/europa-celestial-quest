import FEATURES from './features.js'
import PRIMARY_FUNCTIONS from './primary_functions.js'

const UNIT_PRIMARY_FUNCTIONS = PRIMARY_FUNCTIONS.UNITS;

const UNITS = {
    BOT_SPIDER_1: {
        name: 'B S-1',
        image: './thumbnails/human_units/bot_spider_1.png',
        requiredLevel: 1,
        complete_time: 20000,
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.MISSILE_ATTACK(50, 50, 10000, 10),
            FEATURES.MOVE(0.3, 'walk', 11.5),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "metal", amount: 3 },
            { currency: "hydrogen", amount: 3 },
            { currency: "rock", amount: 3 },
            { currency: "ice", amount: 3 },
            { currency: "power", amount: 10 }
        ],
        mesh: 'B S-1',
    },
    BOT_SPIDER_2: {
        name: 'B S-2',
        image: './thumbnails/human_units/bot_spider_2.png',
        requiredLevel: 1,
        complete_time: 25000,
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.MISSILE_ATTACK(80, 80, 8000, 15),
            FEATURES.MOVE(0.5, 'walk', 11.5),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "metal", amount: 5 },
            { currency: "hydrogen", amount: 5 },
            { currency: "rock", amount: 5 },
            { currency: "ice", amount: 5 },
            { currency: "power", amount: 10 }
        ],
        mesh: 'B S-2',
    },
    DRONE_LASER_1: {
        name: 'D L-1',
        image: './thumbnails/human_units/drone_laser_1.png',
        requiredLevel: 1,
        complete_time: 15000,
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.LASER_ATTACK(80, 80, 4000, 3),
            FEATURES.MOVE(1, 'walk', 25),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "metal", amount: 3 },
            { currency: "hydrogen", amount: 3 },
            { currency: "rock", amount: 3 },
            { currency: "ice", amount: 3 },
            { currency: "power", amount: 10 }
        ],
        mesh: 'D L-1',
    },
    DRONE_LASER_2: {
        name: 'D L-2',
        image: './thumbnails/human_units/drone_laser_2.png',
        requiredLevel: 1,
        complete_time: 20000,
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.LASER_ATTACK(90, 90, 3000, 5),
            FEATURES.MOVE(1.3, 'walk', 25),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "metal", amount: 5 },
            { currency: "hydrogen", amount: 5 },
            { currency: "rock", amount: 5 },
            { currency: "ice", amount: 5 },
            { currency: "power", amount: 10 }
        ],
        mesh: 'D L-2',
    },
    ROVER_RESEARCH_H20: {
        name: 'RR H20',
        image: './thumbnails/human_units/rover_research_h20.png',
        requiredLevel: 1,
        complete_time: 5000,
        primary_function: UNIT_PRIMARY_FUNCTIONS.COLLECTOR,
        features: [
            FEATURES.COLLECT("ice", [{ currency: "power", amount: 1 }], 10, 5000, "Hydrogen Fuel Tank"),
            FEATURES.MOVE(0.6, 'walk', 4.1),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "hydrogen", amount: 0 },
            { currency: "rock", amount: 2 },
            { currency: "ice", amount: 2 },
            { currency: "power", amount: 2 }
        ],
        mesh: 'RR H20',
    },
    ROVER_RESEARCH_D1: {
        name: 'RR D-1',
        image: './thumbnails/human_units/rover_research_d1.png',
        requiredLevel: 1,
        complete_time: 8000,
        primary_function: UNIT_PRIMARY_FUNCTIONS.COLLECTOR,
        features: [
            FEATURES.COLLECT("rock", [{ currency: "power", amount: 1 }], 10, 5000, "Rock Metal Extractor"),
            FEATURES.MOVE(0.6, 'walk', 4.1),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "metal", amount: 0 },
            { currency: "hydrogen", amount: 2 },
            { currency: "rock", amount: 2 },
            { currency: "ice", amount: 2 },
            { currency: "power", amount: 2 }
        ],
        mesh: 'RR D-1',
    },
    ROVER_RESEARCH_S1: {
        name: 'RR S-1',
        image: './thumbnails/human_units/rover_research_d1.png',
        requiredLevel: 1,
        complete_time: 10000,
        primary_function: UNIT_PRIMARY_FUNCTIONS.SCANNER,
        features: [
            FEATURES.MOVE(0.6, 'walk', 4.1),
            FEATURES.SCAN(),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "metal", amount: 2 },
            { currency: "hydrogen", amount: 2 },
            { currency: "rock", amount: 2 },
            { currency: "ice", amount: 2 },
            { currency: "power", amount: 2 }
        ],
        mesh: 'RR S-1',
    },
    ROVER_WARRIOR_3: {
        name: 'RR W-3',
        image: './thumbnails/human_units/rover_warrior_3.png',
        requiredLevel: 1,
        complete_time: 12000,
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.MACHINE_GUN_ATTACK(35, 35, 8000, 3),
            FEATURES.MOVE(0.8, 'walk', 4.1),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "metal", amount: 2 },
            { currency: "hydrogen", amount: 2 },
            { currency: "rock", amount: 2 },
            { currency: "ice", amount: 2 },
            { currency: "power", amount: 5 }
        ],
        mesh: 'RR W-3',
    },
    ROVER_WARRIOR_6: {
        name: 'RR W-6',
        image: './thumbnails/human_units/rover_warrior_6.png',
        complete_time: 15000,
        requiredLevel: 1,
        primary_function: UNIT_PRIMARY_FUNCTIONS.WARRIOR,
        features: [
            FEATURES.MACHINE_GUN_ATTACK(55, 55, 4000, 3),
            FEATURES.MOVE(1, 'walk', 4.1),
            FEATURES.HEALTH(),
        ],
        costs: [
            { currency: "metal", amount: 3 },
            { currency: "hydrogen", amount: 3 },
            { currency: "rock", amount: 3 },
            { currency: "ice", amount: 3 },
            { currency: "power", amount: 5 }
        ],
        mesh: 'RR W-6',
    }
}

export default UNITS
