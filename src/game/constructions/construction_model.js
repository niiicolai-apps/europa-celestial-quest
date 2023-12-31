import { featuresToOptions } from '../definitions/features.js';

/**
 * Setup the construction visuals.
 * 
 * @param {object} object3D
 * @param {array} includeNames
 * @param {array} excludeNames
 * 
 * @return {void}
 */
const setupConstructionVisuals = (object3D, includeNames=[], excludeNames=[]) => {
    object3D.traverse((child) => {
        if (child.isMesh) {
            if (includeNames.includes(child.name)) {
                child.visible = true;
            } else if (excludeNames.includes(child.name)) {
                child.visible = false;
            }
        }
    });
}

/**
 * Setup the upgrade visuals.
 * 
 * @param {object} object3D 
 * @param {array} upgrades 
 * @param {number} upgradeIndex 
 * 
 * @return {void}
 */
const setupUpgradeVisuals = (object3D, upgrades, upgradeIndex) => {
    const activeSubMeshes = ['healthBar'];
    const inactiveSubMeshes = [];

    for (let i = 0; i < upgrades.length; i++) {
        if (i <= upgradeIndex) {
            if (!upgrades[i].subMesh?.name) continue;
            activeSubMeshes.push(upgrades[i].subMesh.name);
        } else {
            if (!upgrades[i].subMesh?.name) continue;
            inactiveSubMeshes.push(upgrades[i].subMesh.name);
        }
    }

    setupConstructionVisuals(object3D, activeSubMeshes, inactiveSubMeshes);
}

export default (object3D, definition, team = 'team-1', isOwned = false, upgradeIndex = 0) => {
    const upgrades = [...definition.upgrades]
    const features = featuresToOptions(upgrades[0].features || []);

    /**
     * Setup the construction visuals.
     */
    if (definition.excludeSubMeshes) {
        setupConstructionVisuals(object3D, [], definition.excludeSubMeshes)
    }

    /**
     * setup the upgrade visuals.
     */
    setupUpgradeVisuals(object3D, upgrades, upgradeIndex)

    /**
     * Upgrade the construction model
     * 
     * @return {void}
     */
    const isUpgradeable = () => {
        return upgradeIndex < (upgrades.length - 1);
    }

    /**
     * Upgrade the construction model
     * 
     * @return {void}
     */
    const upgradeToNext = () => {
        if (isUpgradeable()) {
            upgradeIndex++;
            setupUpgradeVisuals(object3D, upgrades, upgradeIndex)
        }
    }

    /**
     * Get the current upgrade
     * 
     * @return {object}
     */
    const getUpgrade = () => {
        return upgrades[upgradeIndex];
    }

    /**
     * Check if the max upgrade is reached
     * 
     * @return {boolean}
     */
    const isMaxUpgradeReached = () => {
        return upgradeIndex >= upgrades.length-1;
    }

    return {
        object3D,
        upgrades,
        definition,
        features,
        team,
        isOwned,
        upgradeIndex,
        getUpgrade,
        isUpgradeable,
        upgradeToNext,
        isMaxUpgradeReached
    };
}
