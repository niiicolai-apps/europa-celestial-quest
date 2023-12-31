import Base from '../Base.js'
import { useItems } from "../../../constructions/constructions.js";
import { useUnits } from "../../../units/units.js";

export default class LookForEnemy extends Base {
    constructor(manager, options = {}) {
        super(manager, options);

        if (!manager.object.features.attack)
            throw new Error('Manager Attack feature is required');

        const construction = manager.object;
        const upgrade = construction.getUpgrade();
        this.team = construction.team;
        this.object3D = construction.object3D;
        this.foundTarget = false;
    }

    update() {
        const manager = this.manager;
        const construction = manager.object;
        const upgrade = construction.getUpgrade();
        const attackFeature = upgrade.features.find(feature => feature.name === 'attack');

        /**
         * If the attack feature already has a target, do nothing.
         */
        if (attackFeature.options.target) return;

        /**
         * Find the closest non-team construction and unit.
         */
        const closestNonTeamConstruction = useItems().findClosestNotOnTeam(this.object3D.position, this.team).construction?.object3D
        const closestNonTeamUnit = useUnits().findClosestNotOnTeam(this.team, this.object3D.position).unit?.object3D
        let target = null;
        /**
         * If both a construction and unit are found,
         * choose the closest one.
         */
        if (closestNonTeamConstruction && closestNonTeamUnit) {
            const constructionDistance = this.object3D.position.distanceTo(closestNonTeamConstruction.position)
            const unitDistance = this.object3D.position.distanceTo(closestNonTeamUnit.position)
            target = constructionDistance < unitDistance
                ? closestNonTeamConstruction
                : closestNonTeamUnit

            /**
             * If only a construction is found, choose it.
             * If only a unit is found, choose it.
             * If neither are found, do nothing.
             */
        } else if (closestNonTeamConstruction) {
            target = closestNonTeamConstruction
        } else if (closestNonTeamUnit) {
            target = closestNonTeamUnit
        }

        /**
         * If a target is found, set it as the attack target.
         * Otherwise, do nothing.
         */
        if (target) {
            const distance = this.object3D.position.distanceTo(target.position);
            const attackDistance = attackFeature.options.distance;

            /**
             * Only set the target if it is within the attack distance.
             */
            if (distance <= attackDistance) {
                attackFeature.options.target = target;
                this.foundTarget = true;
            }
                
        }
    }

    isComplete() {
        return this.foundTarget;
    }
}