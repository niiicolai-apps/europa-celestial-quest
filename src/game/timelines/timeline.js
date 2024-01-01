import * as THREE from "three";
import utils from "./utils.js";
import { getMesh, removeMesh } from "../models/meshes.js";
import { useTimeline } from "../../composables/timeline.js";
import System, { SpriteRenderer } from 'https://cdn.jsdelivr.net/npm/three-nebula@10.0.3/+esm'

const cameraLookAt = new THREE.Vector3(0, 0, 0);

const setupAudio = (audioCtrl, audio = null) => {
    if (audio) {
        audioCtrl.setSrc(audio.clip);
        audioCtrl.setVolume(audio.volume);
        audioCtrl.setMuted(audio.muted);

        if (audio.muted) {
            audioCtrl.pause();
        } else {
            audioCtrl.play();
        }
    }
}

const hideLights = (lights) => {
    for (const light of lights) {
        light.visible = false;
    }
}

const removeLights = (lights, scene) => {
    for (const light of lights) {
        scene.remove(light);
    }
}

const setupLights = (lights, meshes, scene, sequence) => {
    if (sequence.lights) {
        for (const lightData of sequence.lights) {

            const light = lights.find(l => l.name === lightData.name);

            if (light === undefined)
                throw new Error(`Unknown light name: ${lightData.name}`);

            if (light.parent)
                light.parent.remove(light);
            if (lightData.parent) {
                if (lightData.parent.mesh) {
                    const parentMesh = meshes.find(m => m.name === lightData.parent.mesh.name);
                    if (parentMesh === undefined)
                        throw new Error(`Unknown mesh name: ${lightData.parent.mesh.name}`);
                    parentMesh.mesh.add(light);
                }
            } else {
                scene.add(light);
            }

            if (lightData.position)
                light.position.set(lightData.position.x, lightData.position.y, lightData.position.z);

            if (lightData.rotation)
                light.rotation.set(lightData.rotation.x, lightData.rotation.y, lightData.rotation.z);

            if (lightData.target) {
                light.target.position.set(
                    lightData.target.x,
                    lightData.target.y,
                    lightData.target.z
                );
            }
            light.visible = true;
        }
    }
}

const setupSubTitle = (subTitleCtrl, sequence) => {
    if (sequence.sub_title) {
        subTitleCtrl.showSubTitle(sequence.sub_title);
    } else {
        subTitleCtrl.hideSubTitle();
    }
}

const setupScene = (scene, sequence) => {
    if (sequence.fog) {
        const color = new THREE.Color(
            sequence.fog.color.r,
            sequence.fog.color.g,
            sequence.fog.color.b
        );
        scene.fog = new THREE.FogExp2(color, sequence.fog.density);
    } else {
        scene.fog = null;
    }

    if (sequence.background) {
        if (sequence.background.type === 'CubeTexture') {

            scene.background = new THREE.CubeTextureLoader()
                .setPath(sequence.background.path)
                .load(sequence.background.load);

        } else if (sequence.background.type === 'Color') {

            scene.background = new THREE.Color(
                sequence.background.color.r,
                sequence.background.color.g,
                sequence.background.color.b
            );

        } else {
            throw new Error(`Unknown background type: ${scene.background.type}`);
        }
    }
}

const setupCamera = (camera, meshes, scene, sequence) => {
    utils.stopCamera();
    utils.stopCameraLoop();

    if (sequence.camera) {
        if (camera.parent)
            camera.parent.remove(camera);
        if (sequence.camera.parent) {
            if (sequence.camera.parent.mesh) {
                const parentMesh = meshes.find(m => m.name === sequence.camera.parent.mesh.name);
                if (parentMesh === undefined)
                    throw new Error(`Unknown mesh name: ${sequence.camera.parent.mesh.name}`);
                parentMesh.mesh.add(camera);
            }
        } else {
            scene.add(camera);
        }


        camera.position.set(
            sequence.camera.position.x,
            sequence.camera.position.y,
            sequence.camera.position.z
        );

        camera.rotation.set(
            sequence.camera.rotation.x * Math.PI / 180,
            sequence.camera.rotation.y * Math.PI / 180,
            sequence.camera.rotation.z * Math.PI / 180
        );

        utils.moveCamera(
            camera,
            sequence.camera.move.dx,
            sequence.camera.move.dy,
            sequence.camera.move.dz,
            sequence.camera.rotate.dx,
            sequence.camera.rotate.dy,
            sequence.camera.rotate.dz,
            sequence.camera.shake ? sequence.camera.shake.min.x : 0,
            sequence.camera.shake ? sequence.camera.shake.min.y : 0,
            sequence.camera.shake ? sequence.camera.shake.min.z : 0,
            sequence.camera.shake ? sequence.camera.shake.max.x : 0,
            sequence.camera.shake ? sequence.camera.shake.max.y : 0,
            sequence.camera.shake ? sequence.camera.shake.max.z : 0
        );

        let mesh = null;
        if (sequence.camera.lookAt?.mesh) {
            mesh = meshes.find(m => m.name === sequence.camera.lookAt.mesh.name);
            if (!mesh)
                throw new Error(`Unknown mesh name: ${sequence.camera.lookAt.mesh.name}`);
        }

        if (sequence.camera.lookAt) {
            utils.cameraLoop(() => {

                if (mesh && sequence.camera.lookAt) {
                    cameraLookAt.x = 0;
                    cameraLookAt.y = 0;
                    cameraLookAt.z = 0;


                    if (mesh) {
                        cameraLookAt.set(
                            mesh.mesh.position.x,
                            mesh.mesh.position.y,
                            mesh.mesh.position.z
                        );
                    }

                    if (sequence.camera.lookAt.position) {
                        cameraLookAt.set(
                            cameraLookAt.x + sequence.camera.lookAt.position.x,
                            cameraLookAt.y + sequence.camera.lookAt.position.y,
                            cameraLookAt.z + sequence.camera.lookAt.position.z
                        );
                    }

                    camera.lookAt(cameraLookAt);
                }
            }, 10);
        }
    }
}

const hideMeshes = (meshes, scene) => {
    for (const mesh of meshes) {
        scene.remove(mesh.mesh);
    }
}

const removeMeshes = async (meshes, scene) => {
    for (const mesh of meshes) {
        scene.remove(mesh.mesh);
        await removeMesh(mesh.mesh);
    }
}

const setupMeshes = (meshes, scene, sequence) => {
    utils.stopMeshesLoop();

    if (sequence.meshes) {
        const _meshes = []
        for (const meshData of sequence.meshes) {
            const meshSystem = meshes.find(m => m.id === meshData.id);
            if (meshSystem === undefined)
                throw new Error(`Unknown mesh id: ${JSON.stringify(meshData)}`);
            if (meshData.position)
                meshSystem.mesh.position.set(
                    meshData.position.x,
                    meshData.position.y,
                    meshData.position.z
                );

            if (meshData.rotation)
                meshSystem.mesh.rotation.set(
                    meshData.rotation.x,
                    meshData.rotation.y,
                    meshData.rotation.z
                );

            if (meshData.scale)
                meshSystem.mesh.scale.set(
                    meshData.scale.x,
                    meshData.scale.y,
                    meshData.scale.z
                );

            scene.add(meshSystem.mesh);

            _meshes.push({
                mesh: meshSystem.mesh,
                data: meshData
            });

            if (meshData.subMeshes) {
                meshSystem.mesh.traverse(child => {
                    if (child.isMesh) {
                        const subMesh = meshData.subMeshes.find(sm => sm.name === child.name);
                        if (subMesh) {
                            child.visible = subMesh.visible;
                        }
                    }
                });
            }
        }

        utils.meshesLoop(() => {
            for (const meshSystem of _meshes) {
                if (meshSystem.data.move) {
                    meshSystem.mesh.position.set(
                        meshSystem.mesh.position.x + meshSystem.data.move.dx,
                        meshSystem.mesh.position.y + meshSystem.data.move.dy,
                        meshSystem.mesh.position.z + meshSystem.data.move.dz
                    );
                }

                if (meshSystem.data.rotate) {
                    meshSystem.mesh.rotation.set(
                        meshSystem.mesh.rotation.x + meshSystem.data.rotate.dx,
                        meshSystem.mesh.rotation.y + meshSystem.data.rotate.dy,
                        meshSystem.mesh.rotation.z + meshSystem.data.rotate.dz
                    );
                }
            }
        });
    }
}

const setupParticles = (particles, meshes, sequence) => {
    utils.stopParticlesLoop();

    if (sequence.particles) {
        const _particles = []
        for (const particleData of sequence.particles) {
            const particle = particles.find(p => p.name === particleData.name);

            if (particle === undefined)
                throw new Error(`Unknown particle name: ${particleData.name}`);

            for (const emitter of particle.nebula.emitters) {
                emitter.removeAllParticles();
            }

            if (particleData.position) {
                for (const emitter of particle.nebula.emitters) {
                    emitter.position.x = particleData.position.x;
                    emitter.position.y = particleData.position.y;
                    emitter.position.z = particleData.position.z;
                }
            }

            let parent = null;
            if (particleData.parent) {
                parent = meshes.find(m => m.name === particleData.parent.mesh.name);
                if (parent === undefined)
                    throw new Error(`Unknown mesh name: ${particleData.parent.mesh.name}`);
            }

            _particles.push({ particle, data: particleData, parent, moveOffset: { x: 0, y: 0, z: 0 } });
        }

        utils.particlesLoop(() => {
            for (const particleSystem of _particles) {
                particleSystem.particle.nebula.update();

                if (particleSystem.parent) {
                    for (const emitter of particleSystem.particle.nebula.emitters) {
                        emitter.position.x = particleSystem.parent.mesh.position.x + particleSystem.data.position.x;
                        emitter.position.y = particleSystem.parent.mesh.position.y + particleSystem.data.position.y;
                        emitter.position.z = particleSystem.parent.mesh.position.z + particleSystem.data.position.z;
                    }
                }

                if (particleSystem.data.move) {
                    particleSystem.moveOffset.x += particleSystem.data.move.dx;
                    particleSystem.moveOffset.y += particleSystem.data.move.dy;
                    particleSystem.moveOffset.z += particleSystem.data.move.dz;

                    for (const emitter of particleSystem.particle.nebula.emitters) {
                        emitter.position.x += particleSystem.moveOffset.x;
                        emitter.position.y += particleSystem.moveOffset.y;
                        emitter.position.z += particleSystem.moveOffset.z;
                    }
                }
            }
        });
    }
}


export const TimelineFromJson = async (json, camera, scene, audio1Ctrl, audio2Ctrl, subTitleCtrl, onStop = async () => { }) => {
    const _meshes = [];
    for (const meshData of json.meshes) {
        const { name, id } = meshData;
        const mesh = await getMesh(name);
        if (!mesh) {
            throw new Error(`Failed to load mesh: ${name}`);
        }
        _meshes.push({ name, mesh, id });
    }

    const _particles = [];
    const _particlesJson = {};
    for (const particle of json.particles) {
        let json = _particlesJson[particle.type];
        if (!json) {
            const response = await fetch(`particles/${particle.type}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load particle: ${particle.type}`);
            }
            json = await response.json();
            _particlesJson[particle.type] = json;
        }
        
        const nebulaSystem = await System.fromJSONAsync(json, THREE);
        const nebulaRenderer = new SpriteRenderer(scene, THREE);
        const nebula = nebulaSystem.addRenderer(nebulaRenderer);

        _particles.push({
            name: particle.name,
            nebula
        });
    }

    const _lights = json.lights.map(light => {
        let _light = null;
        const color = new THREE.Color(light.color.r, light.color.g, light.color.b);
        switch (light.type) {
            case 'AmbientLight':
                _light = new THREE.AmbientLight(color, light.intensity);
                break;
            case 'DirectionalLight':
                _light = new THREE.DirectionalLight(color, light.intensity, light.distance);
                break;
            case 'PointLight':
                _light = new THREE.PointLight(color, light.intensity, light.distance);
                break;
            default:
                throw new Error(`Unknown light type: ${light.type}`);
        }
        _light.name = light.name;
        _light.visible = false;
        if (light.castShadow) {
            _light.castShadow = true;
        }
        scene.add(_light);
        return _light;
    });

    const sequencies = json.sequencies.map(sequence => {
        const s = {
            playTime: sequence.playTime,
            callback: () => {
                hideLights(_lights, scene);
                setupLights(_lights, _meshes, scene, sequence);
                setupAudio(audio1Ctrl, sequence.audio_1);
                setupAudio(audio2Ctrl, sequence.audio_2);
                setupSubTitle(subTitleCtrl, sequence);
                setupScene(scene, sequence);
                hideMeshes(_meshes, scene);
                setupMeshes(_meshes, scene, sequence);
                setupParticles(_particles, _meshes, sequence);
                setupCamera(camera, _meshes, scene, sequence);
            }
        }

        if (sequence.transition) {
            s.transition = sequence.transition
        }

        return s;
    });

    const backgroundBefore = scene.background;

    const stop = async () => {
        utils.stopCamera();
        utils.stopCameraLoop();
        utils.stopLoop();
        utils.stopParticlesLoop();
        utils.stopMeshesLoop();
        audio1Ctrl.pause();
        audio2Ctrl.pause();
        subTitleCtrl.hideSubTitle();
        scene.fog = null;
        scene.background = backgroundBefore;
        removeLights(_lights, scene);
        useTimeline().showTransition.value = false;
        await removeMeshes(_meshes, scene);
        await onStop();
    }

    return Timeline([...sequencies, { playTime: 1000, callback: stop }], stop);
}

export const Timeline = (sequencies, onStop = () => { }) => {
    const state = [...sequencies];
    const player = { index: 0 };
    let timeout = null;
    let transitionTimeout = null;

    const playNext = () => {
        const nextSequence = state[player.index];
        let playTime = nextSequence.playTime;

        if (nextSequence.transition) {

            playTime += nextSequence.transition.time;
            useTimeline().showTransition.value = true;
            
            setTimeout(() => {
                useTimeline().showTransition.value = false;
                nextSequence.callback();
            }, nextSequence.transition.time);

        } else {
            nextSequence.callback();
        }
        
        timeout = setTimeout(() => {
            if (player.index >= state.length) {
                player.index = 0;
                return;
            }

            playNext();
        }, playTime);
        player.index++;
    }

    const play = () => {
        if (timeout) return;
        playNext();
    }

    const stop = () => {
        clearTimeout(timeout);
        clearTimeout(transitionTimeout);
        timeout = null;
        transitionTimeout = null;
        player.index = 0;
        onStop();
    }

    const isPlaying = () => {
        return timeout !== null;
    }

    return {
        play,
        stop,
        isPlaying,
    }
}
