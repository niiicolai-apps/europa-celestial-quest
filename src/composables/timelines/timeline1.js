import Timeline from '../timeline.js'
import Camera from '../camera.js';
import Utils from './utils.js';
import { getMesh, removeMesh } from '../meshes.js'
import { useItems } from '../items.js';
import * as THREE from 'three';

import fireParticleJson from '../../particles/fire.json';
import fireForceParticleJson from '../../particles/fire_force.json';
import airForceParticleJson from '../../particles/air_force.json';
import airForce2ParticleJson from '../../particles/air_force2.json';
const { System, Span, SpriteRenderer } = window.Nebula;

export default async (camera, scene, lifeCycle, audio, audioBgg, onEnd = () => { }, subTitleCtrl) => {
    const ambient_light = new THREE.AmbientLight(0xffffff, 0.2);

    const rover_h20 = await getMesh({
        type: 'GLTF',
        url: 'meshes/human_units/rover_research_h20.glb',
        subMeshes: [],
    });

    const terrain = await getMesh({
        type: 'GLTF',
        url: 'meshes/utils/terrain.glb',
        subMeshes: [{
            name: 'map',
            texturePack: 'terrain',
        }],
    });

    const sequence_01 = {
        playTime: 18000,
        callback: () => {
            audioBgg.setSrc('audio/battle-of-the-dragons-8037.mp3');
            audioBgg.setVolume(.3);
            audioBgg.setMuted(false);
            audioBgg.play();

            audio.setSrc('audio/timeline_1/rover_h20_1.mp3');
            audio.setVolume(1);
            audio.setMuted(false);
            audio.play();

            subTitleCtrl.showSubTitle('intro.dialog_1');

            scene.add(rover_h20);
            scene.add(terrain);
            scene.add(ambient_light);

            scene.fog = new THREE.FogExp2(0x000000, 0.01);

            camera.position.set(2.2, 1, -2.4);
            camera.rotation.z = 15 * Math.PI / 180;
            camera.rotation.y = 15 * Math.PI / 180;

            Utils.loop(() => {});
            Utils.moveCamera(camera, .00001, 0, 0);
        }
    }

    const sequence_02 = {
        playTime: 1000,
        callback: () => {
            Utils.stopCamera();
            Utils.stopLoop();
            audio.stop();
        }
    }

    const onStop = () => {
        removeMesh(rover_h20);
        scene.remove(ambient_light);
        scene.fog = null;
        subTitleCtrl.hideSubTitle();
    }

    return Timeline([
        sequence_01,
        sequence_02,
    ], onStop);
}