import { ref } from 'vue';
import { useGround } from './ground.js';
import { useToast } from './toast.js';

const COMMAND_TYPES = {
    REGROUP: 'regroup',
    ATTACK: 'attack',
}

const commands = ref([]);

const isSettingCommand = ref(false);
const isSettingTeam = ref(null);
const isSettingType = ref(null);

const PositionTracker = () => {
    const onPointerDown = (event) => {
        const point = useGround().getIntersectionFromMouse(event);
        if (!point) return;

        const command = useCommands().createOrFindCommand(isSettingTeam.value);

        command.position = point;
        //command.position.y = heightMap.getY(point.x, point.z);
        //warriorMarkerMesh.position.copy(point);
        
        stopTrackCommandPosition();
    }

    const startTrackCommandPosition = (type, team) => {
        if (!type || Object.values(COMMAND_TYPES).indexOf(type) === -1) {
            throw new Error(`Invalid command type: ${type}`);
        }

        //warriorMarkerMesh.visible = true;
        isSettingCommand.value = true;
        isSettingTeam.value = team;
        isSettingType.value = type;
        domElement.value.addEventListener('pointerdown', onPointerDown);
        return true;
    }

    const stopTrackCommandPosition = () => {
        if (!isSettingCommand.value) return;
        
        const type = isSettingType.value;
        const team = isSettingTeam.value;
        const command = createOrFindCommand(team);
        command.type = type;

        //setStateByFunction('warrior', type);

        isSettingCommand.value = false;
        isSettingTeam.value = null;

        useToast().add(`toasts.units.set_warrior_command.${command.type}`, 4000, 'info');
        domElement.value.removeEventListener('pointerdown', onPointerDown);
    }
}

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
            command = { team, type: COMMAND_TYPES.REGROUP, position: { x: 0, y: 0, z: 0 } };
            commands.value.push(command);
        }

        return command;
    }

    const setCommand = (type, position, team) => {
        if (!type || Object.values(COMMAND_TYPES).indexOf(type) === -1) {
            throw new Error(`Invalid command type: ${type}`);
        }

        if (!position) {
            throw new Error(`Position is required`);
        }

        if (!team) {
            throw new Error(`Team is required`);
        }

        const command = createOrFindCommand(team);

        command.type = type;
        command.position = position;
    }

    const getCommand = (team='player') => {
        const command = commands.value.find(c => c.team === team);
        return command;
    }

    return {
        COMMAND_TYPES,
        commands,
        isSettingCommand,
        isSettingTeam,
        isSettingType,
        createOrFindCommand,
        setCommand,
        getCommand,
        PositionTracker,
    }
}

    