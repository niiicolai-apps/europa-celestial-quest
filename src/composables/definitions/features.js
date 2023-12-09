
const FEATURES = {
    MISSILE_ATTACK: (distance = 5, rate = 2, damage = 15) => {
        return {
            name: 'attack',
            options: {
                type: 'missile',
                target: null,
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
                target: null,
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
                target: null,
                distance,
                rate,
                damage,
            }
        }
    },
    MOVE: (speed = 1.1, type = 'walk', groundOffset = 1) => {
        return {
            name: 'move',
            options: {
                destination: null,
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
                current: maxHealth,
                maxHealth,
                onDie: () => { },
            }
        }
    },
    COLLECT: (type = 'rock', costs=[{ currency: "power", amount: 1 }], max = 1, speed = 5000, deliver_construction = 'Hydrogen Fuel Tank') => {
        return {
            name: 'collect',
            options: {
                collected: 0,
                target: null,
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
                target: null,
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

export default FEATURES;
