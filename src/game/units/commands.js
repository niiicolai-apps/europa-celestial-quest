import { ref } from 'vue';
import { useGround } from '../map/ground.js';
import { useToast } from '../../composables/toast.js';
import { useManager } from '../managers/manager.js';
import { useCanvas } from '../../composables/canvas.js';
import { usePlayers } from '../players/player.js';
import * as THREE from 'three';

const COMMAND_TYPES = {
    REGROUP: 'regroup',
    ATTACK: 'attack',
}

const commands = ref([]);

const isSettingCommand = ref(false);
const isSettingTeam = ref(null);
const isSettingType = ref(null);

const markerMesh = ref(null);
const markerLastPosition = ref(null);
const markerYSpeed = ref(0.05);
const markerYOffset = 5;
const markerYMove = 0.5;
const regroupColor = 0x0000ff;
const attackColor = 0xff0000;
const isInitialized = ref(false);

const PositionTracker = () => {

    const setMarkerPosition = (position) => {
        markerMesh.value.position.x = position.x;
        markerMesh.value.position.y = position.y + markerYOffset;
        markerMesh.value.position.z = position.z;
        
        markerLastPosition.value = markerMesh.value.position.clone();
    }

    const onPointerDown = (event) => {
        const point = useGround().getIntersectionFromMouse(event);
        if (!point) return;

        const command = useCommands().createOrFindCommand(isSettingTeam.value);
        const type = isSettingType.value;
        const team = isSettingTeam.value;

        command.position = point;
        
        //command.position.y = heightMap.getY(point.x, point.z);
        setMarkerPosition(command.position);
        markerMesh.value.material.color.set(type === COMMAND_TYPES.REGROUP 
            ? regroupColor 
            : attackColor);

        const players = usePlayers();
        const player = players.get(team);
        player.setUnitsStateByPrimaryFunction(type);

        useToast().add(`toasts.units.set_warrior_command.${command.type}`, 4000, 'info');

        stopTrackCommandPosition();
    }

    const startTrackCommandPositionYou = (type) => {
        const players = usePlayers();
        const player = players.findYou();
        startTrackCommandPosition(type, player.team);
    }

    const startTrackCommandPosition = (type, team) => {
        if (!type || Object.values(COMMAND_TYPES).indexOf(type) === -1) {
            throw new Error(`Invalid command type: ${type}`);
        }

        markerMesh.value.visible = true;
        isSettingCommand.value = true;
        isSettingTeam.value = team;
        isSettingType.value = type;

        const command = useCommands().createOrFindCommand(team);
        command.type = type;

        const canvas = useCanvas()
        const adapter = canvas.adapter.value
        const domElement = adapter.renderer.domElement;
        domElement.addEventListener('pointerdown', onPointerDown);
    }

    const stopTrackCommandPosition = () => {
        if (!isSettingCommand.value) return;

        isSettingCommand.value = false;
        isSettingTeam.value = null;

        const canvas = useCanvas()
        const adapter = canvas.adapter.value
        const domElement = adapter.renderer.domElement;
        domElement.removeEventListener('pointerdown', onPointerDown);
    }

    return {
        startTrackCommandPositionYou,
        startTrackCommandPosition,
        stopTrackCommandPosition,
        setMarkerPosition,
    }
}

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('units_command', {
    init: {
        priority: 1,
        callback: async (options) => {
            if (isInitialized.value) return false

            const canvas = useCanvas()
            const adapter = canvas.adapter.value
            const scene = adapter.scene;

            const markerRadius = 2;  
            const markerHeight = 5;  
            const markerRadialSegments = 16;  
            const markerGeometry = new THREE.ConeGeometry( markerRadius, markerHeight, markerRadialSegments );
            const markerMaterial = new THREE.MeshBasicMaterial({ color: regroupColor, transparent: true, opacity: .9 });
            markerMesh.value = new THREE.Mesh(markerGeometry, markerMaterial);
            markerMesh.value.rotation.x = Math.PI;
            scene.add(markerMesh.value);

            isInitialized.value = true;
        }
    },
    update: {
        priority: 1,
        callback: () => {
            if (!isInitialized.value) return false
            if (markerMesh.value && markerLastPosition.value) {
                if (markerMesh.value.position.y < markerLastPosition.value.y - markerYMove) {
                    markerYSpeed.value = Math.abs(markerYSpeed.value);
                } else if (markerMesh.value.position.y > markerLastPosition.value.y + markerYMove) {
                    markerYSpeed.value = -Math.abs(markerYSpeed.value);
                }

                markerMesh.value.position.y += markerYSpeed.value;
            }
        }
    },
    onBeforeTimeline: {
        priority: 1,
        callback: () => {
            if (!isInitialized.value) return false
            markerMesh.value.visible = false;
        }
    },
    onAfterTimeline: {
        priority: 1,
        callback: () => {
            if (!isInitialized.value) return false
            markerMesh.value.visible = true;
        }
    },
    disable: {
        priority: 1,
        callback: () => {
            if (!isInitialized.value) return false
            markerMesh.value.visible = false;
        }
    }
})

export const useCommands = () => {

    const findCommand = (team) => {
        if (!team) {
            throw new Error(`Team is required`);
        }

        return commands.value.find(c => c.team === team);
    }

    const createOrFindCommand = (team) => {
        if (!team) {
            throw new Error(`Team is required`);
        }

        let command = findCommand(team)
        if (!command) {
            command = {
                team,
                type: COMMAND_TYPES.REGROUP,
                position: { x: 0, y: 0, z: 0 }
            };

            commands.value.push(command);
        }

        return command;
    }

    const setCommand = (type, position, team) => {
        if (!type || Object.values(COMMAND_TYPES).indexOf(type) === -1) {
            throw new Error(`Invalid command type: ${type}`);
        }

        if (!team) {
            throw new Error(`Team is required`);
        }

        const command = createOrFindCommand(team);

        command.type = type;
        
        if (position) {
            command.position = position;
        }
    }

    const getCommand = (team) => {
        return commands.value.find(c => c.team === team);
    }

    const getCommandYou = () => {
        const players = usePlayers();
        const player = players.findYou();
        return getCommand(player.team);
    }

    return {
        COMMAND_TYPES,
        commands,
        isSettingCommand,
        isSettingTeam,
        isSettingType,
        createOrFindCommand,
        findCommand,
        setCommand,
        getCommand,
        getCommandYou,
        PositionTracker,
    }
}

