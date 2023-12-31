import { expect, test } from 'vitest'
import SpawnArmy from '../../../../../src/game/state_machine/states/computer/spawn_army.js'
import ComputerModel from '../../../../../src/game/state_machine/models/computer.js'

import * as THREE from 'three'

const object3D = new THREE.Object3D()
const stateMethods = { SPAWN_ARMY: SpawnArmy }
const behavior = {
    states: [{
        name: 'state',
        actions: [{
            method: 'spawn_army', options: {
                "attack": {
                    "delay": 10000,
                    "build_speed": 5
                },
                "army": [
                    {
                        "name": "RR W-3",
                        "construction": "Rover Warrior Facility",
                        "count": 1
                    },
                    {
                        "name": "B S-1",
                        "construction": "Robot Facility",
                        "count": 1
                    },
                    {
                        "name": "D L-1",
                        "construction": "Drone Facility",
                        "count": 1
                    }
                ]
            }
        }]
    }]
}

test('create should create a new unit', async () => {
})