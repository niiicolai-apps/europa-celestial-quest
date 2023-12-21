
const PARTICLES = {
    MACHINE_GUN_MUZZLE: {
        name: 'machine_gun_muzzle',
        force: { x: 100, y: 100, z: 100 },
    },
    MACHINE_GUN_HIT: {
        name: 'machine_gun_hit',
        force: { x: 0, y: 0, z: 0 },
    },
}

const FEATURES = {
    MISSILE_ATTACK: (
        distance = 45,
        rate = 1000,
        damage = 1,
        muzzleParticle = PARTICLES.MACHINE_GUN_MUZZLE,
        hitParticle = PARTICLES.MACHINE_GUN_HIT
    ) => {
        return {
            name: 'attack',
            options: {
                type: 'missile',
                target: null,
                distance,
                rate,
                damage,
                muzzleParticle,
                hitParticle,
            }
        }
    },
    MACHINE_GUN_ATTACK: (
        distance = 25,
        rate = 1000,
        damage = 1,
        muzzleParticle = PARTICLES.MACHINE_GUN_MUZZLE,
        hitParticle = PARTICLES.MACHINE_GUN_HIT
    ) => {
        return {
            name: 'attack',
            options: {
                type: 'machine_gun',
                target: null,
                distance,
                rate,
                damage,
                muzzleParticle,
                hitParticle,
            }
        }
    },
    LASER_ATTACK: (
        distance = 25,
        rate = 1000,
        damage = 1,
        muzzleParticle = PARTICLES.MACHINE_GUN_MUZZLE,
        hitParticle = PARTICLES.MACHINE_GUN_MUZZLE
    ) => {
        return {
            name: 'attack',
            options: {
                type: 'laser',
                target: null,
                distance,
                rate,
                damage,
                muzzleParticle,
                hitParticle,
            }
        }
    },
    MOVE: (
        speed = 1.1,
        type = 'walk',
        groundOffset = 1
    ) => {
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
                maxHealth
            }
        }
    },
    COLLECT: (
        type = 'rock',
        costs = [{ currency: "power", amount: 1 }],
        max = 1,
        speed = 5000,
        deliver_construction = 'Hydrogen Fuel Tank'
    ) => {
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
    STORAGE: (
        type = 'rock',
        max = 100
    ) => {
        return {
            name: 'storage',
            options: {
                type,
                max,
            }
        }
    },
    MAX_INCREASER: (
        amount = 2
    ) => {
        return {
            name: 'max_increaser',
            options: {
                amount,
            }
        }
    },
    PRODUCE: (
        type = 'hydrogen',
        costs = [],
        rate = 1,
        speed = 5000
    ) => {
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
    SCAN: (
        type = 'research',
        costs = [{ currency: "power", amount: 1 }],
        rate = 0.1,
        speed = 5000,
        deliver_construction = 'Europa Horizon Drifter X1'
    ) => {
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
    LOOK_AT: (
        rotateable_child_names = [],
        rotate_speed = 0.1
    ) => {
        return {
            name: 'look_at',
            options: {
                rotateable_child_names,
                rotate_speed
            }
        }
    },
}

export default FEATURES;
