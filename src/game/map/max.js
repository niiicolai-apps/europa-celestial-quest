import { ref } from 'vue';
import { useItems } from '../constructions/constructions.js';
import { useUnits } from '../units/units.js';

const controllers = ref([]);
const total = 100;

const Controller = (team, _constructions={default:10, max:10, total: 100}, _units={default:10, max:10, total: 100}) => {
    const constructions = ref(_constructions);
    const units = ref(_units);

    const hasReachedMaxConstructions = () => {
        const constructionsManager = useItems();
        const count = constructionsManager.countByTeam(team);
        return count >= constructions.value.max;
    }

    const hasReachedMaxUnits = () => {
        const unitsManager = useUnits();
        const count = unitsManager.countByTeam(team);
        return count >= units.value.max;
    }

    const hasReachedMax = () => {
        return hasReachedMaxConstructions() && hasReachedMaxUnits();
    }

    const canSpawnOneMoreConstruction = () => {
        const constructionsManager = useItems();
        const count = constructionsManager.countByTeam(team);
        return count < constructions.value.max;
    }

    const canSpawnOneMoreUnit = () => {
        const unitsManager = useUnits();
        const count = unitsManager.countByTeam(team);
        return count < units.value.max;
    }

    const recalculateMax = () => {
        let max = 0;
        const constructionsManager = useItems();
        const _constructions = constructionsManager.findAllByTeam(team);
        
        for (const construction of _constructions) {
            if (!construction.isOwned) continue;
            const upgrade = construction.getUpgrade();
            const features = upgrade.features;
            const max_increaser = features.find(feature => feature.name === 'max_increaser');
            
            if (max_increaser) {
                max += max_increaser.options.amount;
            }
        }

        setConstructionsMax(max + constructions.value.default);
        setUnitsMax(max + units.value.default);
    }

    const setConstructionsMax = (amount) => {
        constructions.value.max = amount;
        if (constructions.value.max > constructions.value.total) {
            constructions.value.max = constructions.value.total;
        } else if (constructions.value.max < constructions.value.default) {
            constructions.value.max = constructions.value.default;
        }
    }

    const setUnitsMax = (amount) => {
        units.value.max = amount;
        if (units.value.max > units.value.total) {
            units.value.max = units.value.total;
        } else if (units.value.max < units.value.default) {
            units.value.max = units.value.default;
        }
    }

    const getUnitsCount = () => {
        const unitsManager = useUnits();
        return unitsManager.countByTeam(team);
    }

    const getConstructionsCount = () => {
        const constructionsManager = useItems();
        return constructionsManager.countByTeam(team);
    }

    return {
        constructions,
        units,
        hasReachedMaxConstructions,
        hasReachedMaxUnits,
        hasReachedMax,
        canSpawnOneMoreConstruction,
        canSpawnOneMoreUnit,
        recalculateMax,
        setConstructionsMax,
        setUnitsMax,
        getUnitsCount,
        getConstructionsCount,
        team,
    }
}

export const useMax = () => {

    const add = (team, constructions, units) => {
        const controller = Controller(team, constructions, units);
        controllers.value.push(controller);
        return controller;
    }

    const remove = (team) => {
        const index = controllers.value.findIndex(c => c.team === team);
        if (index === -1) return;
        controllers.value.splice(index, 1);
    }

    const find = (team) => {
        return controllers.value.find(c => c.team === team);
    }

    return {
        controllers,
        total,
        Controller,
        add,
        remove,
        find,
    }
}
