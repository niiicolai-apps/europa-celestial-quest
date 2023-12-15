
export const setupConstructionVisuals = (construction, includeNames=[], excludeNames=[]) => {
    construction.traverse((child) => {
        if (child.isMesh) {
            if (includeNames.includes(child.name)) {
                child.visible = true;
            } else if (excludeNames.includes(child.name)) {
                child.visible = false;
            }
        }
    });
}

export const setupUpgradeVisuals = (construction) => {
    const upgrades = construction.userData.upgrades;
    const upgradeIndex = construction.userData.upgrade.index;

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

    setupConstructionVisuals(construction, activeSubMeshes, inactiveSubMeshes);
}
