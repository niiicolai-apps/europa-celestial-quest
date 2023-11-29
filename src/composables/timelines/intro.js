import Timeline from '../timeline.js'
import { getMesh } from '../meshes.js'
import { useItems } from '../items.js';
import * as THREE from 'three';

import fireParticleJson from '../../particles/fire.json';
import fireForceParticleJson from '../../particles/fire_force.json';
import airForceParticleJson from '../../particles/air_force.json';
import airForce2ParticleJson from '../../particles/air_force2.json';
const { System, Span, SpriteRenderer } = window.Nebula;
const system = new System();

const itemsManager = useItems();

export default async (camera, scene, lifeCycle, audio, audioBgg) => {
    const ambient_light = new THREE.AmbientLight(0xffffff, .15);

    const womans_house_light_01 = new THREE.PointLight(0xAA4203, .3, 80);
    const womans_house_light_02 = new THREE.DirectionalLight(0xF6F1D5, 2);
    const womans_house_light_03 = new THREE.PointLight(0xAA4203, .6, 130);
    const womans_house_light_04 = new THREE.PointLight(0xAA4203, .8, 40);

    womans_house_light_01.position.set(2.6, .8, -2.6);
    womans_house_light_02.position.set(15, 15, 0);
    womans_house_light_02.target.position.set(2.6, .7, -2.7);
    womans_house_light_03.position.set(1, .8, -1.6);
    womans_house_light_04.position.set(1.77, 1, -2.72);
    womans_house_light_01.castShadow = true;
    womans_house_light_02.castShadow = true;
    womans_house_light_03.castShadow = true;
    womans_house_light_04.castShadow = true;

    const space_light_01 = new THREE.DirectionalLight(0xffffff, 1.4, 100);
    const space_ship_light_01 = new THREE.PointLight(0xFF0000, 44.4, 10);
    space_light_01.position.set(-100, 100, 0);
    space_light_01.target.position.set(0, 0, 1);
    space_light_01.castShadow = true;
    space_ship_light_01.castShadow = true;

    const nebulaSystemFire = await System.fromJSONAsync(fireParticleJson, THREE);
    const nebulaRendererFire = new SpriteRenderer(scene, THREE);
    const nebulaFire = nebulaSystemFire.addRenderer(nebulaRendererFire);

    const nebulaSystemFire2 = await System.fromJSONAsync(fireParticleJson, THREE);
    const nebulaRendererFire2 = new SpriteRenderer(scene, THREE);
    const nebulaFire2 = nebulaSystemFire2.addRenderer(nebulaRendererFire2);
    nebulaFire2.emitters[0].position.x = 1.77;
    nebulaFire2.emitters[0].position.z = -2.72;

    const nebulaSystemAirForce = await System.fromJSONAsync(airForceParticleJson, THREE);
    const nebulaRendererAirForce = new SpriteRenderer(scene, THREE);
    const nebulaAirForce = nebulaSystemAirForce.addRenderer(nebulaRendererAirForce);

    const nebulaSystemAirForce2 = await System.fromJSONAsync(airForce2ParticleJson, THREE);
    const nebulaRendererAirForce2 = new SpriteRenderer(scene, THREE);
    const nebulaAirForce2 = nebulaSystemAirForce2.addRenderer(nebulaRendererAirForce2);

    const nebulaSystemFireForce = await System.fromJSONAsync(fireForceParticleJson, THREE);
    const nebulaRendererFireForce = new SpriteRenderer(scene, THREE);
    const nebulaFireForce = nebulaSystemFireForce.addRenderer(nebulaRendererFireForce);
    
    const womans_house = await getMesh({
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
    });

    const womans_hand = await getMesh({
        type: 'GLTF',
        url: 'meshes/utils/womans_hand.glb',
        subMeshes: [],
    });

    const woman_with_poem = await getMesh({
        type: 'GLTF',
        url: 'meshes/utils/woman_with_poem.glb',
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
    });

    const jupiter = await getMesh({
        type: 'GLTF',
        url: 'meshes/utils/jupiter.glb',
        subMeshes: [],
    });

    const europa = await getMesh({
        type: 'GLTF',
        url: 'meshes/utils/europa.glb',
        subMeshes: [],
    });

    const europa_horizon_drifter_x1 = await getMesh({
        type: 'GLTF',
        url: 'meshes/human_construction/europa_horizon_drifter_x1.glb',
        subMeshes: [{
            name: 'Cube',
            texturePack: 'default',
        }],
    });

    const terrain = await getMesh({
        type: 'GLTF',
        url: 'meshes/utils/terrain.glb',
        subMeshes: [],
    });

    let interval = null;
    let movementInterval = null;

    const moveCamera = (dx, dy, dz) => {
        let x = camera.position.x;
        let y = camera.position.y;
        let z = camera.position.z;
        movementInterval = setInterval(() => {
            camera.position.set(x, y, z);
            x += dx;
            y += dy;
            z += dz;
        }, 10);
    }

    const shakeCamera = (x, y, z, x_min, x_max, y_min, y_max, z_min, z_max) => {
        camera.position.set(
            x + Math.random() * (x_max - x_min) + x_min,
            y + Math.random() * (y_max - y_min) + y_min,
            z + Math.random() * (z_max - z_min) + z_min
        );
    }

    const stopCamera = () => {
        clearInterval(movementInterval);
    }

    const loop = (callback, framerate=10) => {
        interval = setInterval(callback, framerate);
    }

    const stopLoop = () => {
        clearInterval(interval);
    }

    const setParachuteAndLegsVisible = (visibleParachute, visibleLegs) => {
        europa_horizon_drifter_x1.traverse((child) => {
            if (child.isMesh && child.name === 'Parachute') {
                child.visible = visibleParachute;
            } else if (child.isMesh && child.name === 'Leg1' ||
                    child.isMesh && child.name === 'Leg2' ||
                    child.isMesh && child.name === 'Leg3' ||
                    child.isMesh && child.name === 'Leg4') {
                child.visible = visibleLegs;
            }
        });
    }

    const sequence_01 = {
        playTime: 18000,
        callback: () => {
            audioBgg.setSrc('audio/battle-of-the-dragons-8037.mp3');
            audioBgg.setVolume(.3);
            audioBgg.setMuted(false);
            audioBgg.play();

            audio.setSrc('audio/intro_dialog_1.mp3');
            audio.setVolume(1);
            audio.setMuted(false);
            audio.play();

            scene.add(womans_house);
            //scene.add(womans_hand);
            scene.add(womans_house_light_01);
            scene.add(womans_house_light_02);
            scene.add(womans_house_light_03);
            scene.add(ambient_light);

            scene.fog = new THREE.FogExp2(0x000000, 0.01);

            womans_house.position.set(0, 0, 0);
            womans_hand.position.set(2.25, .7, -2.3);

            camera.position.set(2.2, 1, -2.4);
            camera.rotation.z = 15 * Math.PI / 180;
            camera.rotation.y = 15 * Math.PI / 180;
            loop(() => {
                camera.rotation.z -= .0001;
                camera.rotation.y -= .0001;
                nebulaFire.update();
                nebulaFire2.update();
            });
            moveCamera(.00001, 0, 0);
        }
    }

    const sequence_02 = {
        playTime: 20000,
        callback: () => {
            stopLoop();
            stopCamera();
            audio.setSrc('audio/intro_dialog_2.mp3');
            audio.play();
            scene.add(woman_with_poem);
            scene.remove(womans_hand);
            woman_with_poem.position.set(2.25, .6, -1.3);
            woman_with_poem.scale.set(1.1, 1.1, 1.1);
            woman_with_poem.rotation.y = 90 * Math.PI / 180;
            camera.position.set(0, 1, 0);
            camera.rotation.set(0, -1, 0);
            nebulaFireForce.emitters[0].position.x = 150.77;
            nebulaFireForce.emitters[0].position.z = -70.72;
            nebulaFireForce.emitters[0].position.y = 1;
            moveCamera(0, 0, .0001);
            loop(() => {
                nebulaFire.update();
                nebulaFire2.update();
                nebulaFireForce.update();
                nebulaFireForce.emitters[0].position.y += .01;
                nebulaFireForce.emitters[0].position.z += .01;
            }, 1000 / 60);
        }
    }

    const sequence_03 = {
        playTime: 11500,
        callback: () => {
            stopLoop();
            stopCamera();
            audio.setSrc('audio/intro_dialog_3.mp3');
            audio.play();
            camera.position.set(1.6, 1, -.7);
            moveCamera(.0001, 0, .0001);
            loop(() => {
                nebulaFire.update();
                nebulaFire2.update();
                nebulaFireForce.update();
                nebulaFireForce.emitters[0].position.y += .01;
                nebulaFireForce.emitters[0].position.z += .01;
            }, 1000 / 60);
        }
    }

    const sequence_04 = {
        playTime: 8500,
        callback: () => {
            stopCamera();
            stopLoop();
            setParachuteAndLegsVisible(false, false);

            scene.remove(woman_with_poem);
            scene.remove(womans_house);
            scene.remove(womans_house_light_01);
            scene.remove(womans_house_light_02);
            scene.remove(womans_house_light_03);
            scene.remove(ambient_light);

            scene.add(space_light_01);
            scene.add(jupiter);
            scene.add(europa);
            scene.add(europa_horizon_drifter_x1);
            scene.fog = new THREE.FogExp2(0x000000, 0.001);

            audio.setSrc('audio/intro_poem_1.mp3');
            audio.play();

            jupiter.position.set(100, -100, 800);
            jupiter.scale.set(.25, .25, .25);

            europa.position.set(110, -100, 500);
            europa.scale.set(.15, .15, .15);

            europa_horizon_drifter_x1.position.set(50, -30, 50);
            europa_horizon_drifter_x1.rotation.x = 90 * Math.PI / 180;

            camera.position.set(-40, 10, -40);

            space_ship_light_01.position.set(
                europa_horizon_drifter_x1.position.x - 3,
                europa_horizon_drifter_x1.position.y + 1,
                europa_horizon_drifter_x1.position.z + 1
            );
            europa_horizon_drifter_x1.add(space_ship_light_01);
            
            loop(() => {
                europa_horizon_drifter_x1.position.y -= .01;
                europa_horizon_drifter_x1.position.z += .1;
                europa_horizon_drifter_x1.rotation.z -= .0001;
                
                camera.lookAt(europa_horizon_drifter_x1.position);
            });
        }
    }

    const sequence_05 = {
        playTime: 8500,
        callback: () => {
            stopLoop();

            europa_horizon_drifter_x1.rotation.y = 100 * Math.PI / 180;

            camera.position.set(
                europa_horizon_drifter_x1.position.x - 4,
                europa_horizon_drifter_x1.position.y + 1,
                europa_horizon_drifter_x1.position.z - 3
            );
            camera.lookAt(
                europa_horizon_drifter_x1.position.x,
                europa_horizon_drifter_x1.position.y,
                europa_horizon_drifter_x1.position.z + 3
            );

            loop(() => {
                europa_horizon_drifter_x1.position.y -= .01;
                europa_horizon_drifter_x1.position.z += .1;
                
                camera.position.set(
                    europa_horizon_drifter_x1.position.x - 4,
                    europa_horizon_drifter_x1.position.y + 1,
                    europa_horizon_drifter_x1.position.z - 3
                );
            });
        }
    }

    const sequence_06 = {
        playTime: 8500,
        callback: () => {
            audio.setSrc('audio/intro_poem_2.mp3');
            audio.play();
            stopCamera();
            stopLoop();

            scene.fog = new THREE.FogExp2(0x000000, 0.005);

            jupiter.scale.set(.3, .3, .3);

            europa.scale.set(.1, .1, .1);
            europa_horizon_drifter_x1.rotation.x = 0;
            europa_horizon_drifter_x1.scale.set(.1, .1, .1);
            europa_horizon_drifter_x1.position.set(
                europa.position.x,
                europa.position.y + 20,
                europa.position.z
            );

            camera.position.set(
                europa.position.x,
                europa.position.y + 10,
                europa.position.z - 30
            );
            camera.lookAt(
                europa_horizon_drifter_x1.position.x,
                europa_horizon_drifter_x1.position.y - 10,
                europa_horizon_drifter_x1.position.z
            );

            loop(() => {
                europa_horizon_drifter_x1.position.y -= .01;
                europa_horizon_drifter_x1.position.z += .1;

                nebulaAirForce.update();
                nebulaAirForce.emitters[0].position.x = europa_horizon_drifter_x1.position.x + .2;
                nebulaAirForce.emitters[0].position.y = europa_horizon_drifter_x1.position.y - .5;
                nebulaAirForce.emitters[0].position.z = europa_horizon_drifter_x1.position.z + .5;

            });

            moveCamera(0, .001, 0);
        }
    }

    const sequence_07 = {
        playTime: 9000,
        callback: () => {
            stopCamera();
            stopLoop();
            setParachuteAndLegsVisible(false, false);

            scene.remove(europa)
            scene.add(terrain);
            scene.fog = new THREE.FogExp2(0x000000, 0.001);

            jupiter.scale.set(1, 1, 1);

            terrain.position.set(0, -250, 0);
            terrain.scale.set(.5, .5, .5);

            europa_horizon_drifter_x1.scale.set(1, 1, 1);
            europa_horizon_drifter_x1.rotation.set(0, 0, 0)
            europa_horizon_drifter_x1.position.set(
                terrain.position.x - 20,
                terrain.position.y + 80,
                terrain.position.z
            );

            camera.position.set(
                terrain.position.x,
                terrain.position.y + 5,
                terrain.position.z - 260
            );
            camera.lookAt(
                europa_horizon_drifter_x1.position.x,
                europa_horizon_drifter_x1.position.y - 10,
                europa_horizon_drifter_x1.position.z
            );

            const min = -0.8;
            const max = 0.8;
            loop(() => {
                europa_horizon_drifter_x1.position.y -= .01;
                europa_horizon_drifter_x1.position.z += .01;

                nebulaFireForce.update();
                nebulaFireForce.emitters[0].position.x = europa_horizon_drifter_x1.position.x;
                nebulaFireForce.emitters[0].position.y = europa_horizon_drifter_x1.position.y - 3;
                nebulaFireForce.emitters[0].position.z = europa_horizon_drifter_x1.position.z + 1;

                shakeCamera(
                    terrain.position.x,
                    terrain.position.y + 5,
                    terrain.position.z - 260,
                    min,
                    max,
                    0,
                    0,
                    min,
                    max
                );
            });

        }
    }

    const sequence_08 = {
        playTime: 8000,
        callback: () => {
            setParachuteAndLegsVisible(true, false);
            stopCamera();
            stopLoop();

            audio.setSrc('audio/intro_poem_3.mp3');
            audio.play();

            europa_horizon_drifter_x1.rotation.y = 75 * Math.PI / 180;

            camera.position.set(
                europa_horizon_drifter_x1.position.x + 10,
                europa_horizon_drifter_x1.position.y + 40,
                europa_horizon_drifter_x1.position.z + 1
            );
            camera.lookAt(
                europa_horizon_drifter_x1.position.x,
                europa_horizon_drifter_x1.position.y - 10,
                europa_horizon_drifter_x1.position.z
            );

            const min = -0.8;
            const max = 0.8;
            loop(() => {
                europa_horizon_drifter_x1.position.y -= .05;
                europa_horizon_drifter_x1.position.z += .01;

                nebulaAirForce2.update();
                nebulaAirForce2.emitters[0].position.x = europa_horizon_drifter_x1.position.x;
                nebulaAirForce2.emitters[0].position.y = europa_horizon_drifter_x1.position.y - 5;
                nebulaAirForce2.emitters[0].position.z = europa_horizon_drifter_x1.position.z + 1;

                shakeCamera(
                    europa_horizon_drifter_x1.position.x + 10,
                    europa_horizon_drifter_x1.position.y + 40,
                    europa_horizon_drifter_x1.position.z + 1,
                    min,
                    max,
                    0,
                    0,
                    min,
                    max
                );
            });
        }
    }

    const sequence_09 = {
        playTime: 8000,
        callback: () => {
            stopLoop();
            setParachuteAndLegsVisible(false, true);

            jupiter.scale.set(.9, .9, .9);
            jupiter.position.set(
                terrain.position.x - 740,
                terrain.position.y - 20,
                terrain.position.z + 820
            );
            
            europa_horizon_drifter_x1.rotation.y = 0 * Math.PI / 180;
            europa_horizon_drifter_x1.position.set(
                terrain.position.x,
                terrain.position.y - 90,
                terrain.position.z - 80
            );

            camera.position.set(
                terrain.position.x + 20,
                terrain.position.y - 90,
                terrain.position.z - 120
            );
            camera.lookAt(
                europa_horizon_drifter_x1.position.x,
                europa_horizon_drifter_x1.position.y + 1,
                europa_horizon_drifter_x1.position.z
            );

            moveCamera(0, .001, -.01);
            loop(() => {
                camera.rotation.z += .0001;
                camera.rotation.y += .0001;
            })
        }
    }

    const sequence_10 = {
        playTime: 1,
        callback: () => {
            stopCamera();
            stopLoop();
        }
    }

    return Timeline([
        sequence_01,
        sequence_02,
        sequence_03,
        sequence_04,
        sequence_05,
        sequence_06,
        sequence_07,
        sequence_08,
        sequence_09,
        sequence_10,
    ]);
}