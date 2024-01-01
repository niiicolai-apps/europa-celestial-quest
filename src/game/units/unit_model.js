import { featuresToOptions } from '../definitions/features.js';
import StateMachineController from '../state_machine/state_machine_controller.js';

export default (object3D, data, team = 'team-1') => {
    const features = featuresToOptions(data.features);

    return {
        object3D,
        data,
        features,
        team
    };
}
