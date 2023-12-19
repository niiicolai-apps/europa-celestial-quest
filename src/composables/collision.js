import * as THREE from "three";
import { useInspect } from "../game/inspect/inspect.js";

export const useCollision = () => {

    const selectables = () => {
        const inspectManager = useInspect();
        const selectableManager = inspectManager.selectableManager.value;
        return selectableManager.selectables.get();
    }

    const collideWithBox = (object, box3) => {
        const _selectables = selectables();

        for (const selectable of _selectables) {
            if (object.uuid === selectable.uuid) continue;
            const box3Selectable = new THREE.Box3().setFromObject(selectable);
            if (box3.intersectsBox(box3Selectable)) {
                return true;
            }
        }
        return false;
    }

    const isColliding = (object) => {
        const box3 = new THREE.Box3().setFromObject(object);
        return collideWithBox(object, box3);
    }

    const isCollidingAt = (object, point) => {
        const box3 = new THREE.Box3().setFromObject(object);
        const min = box3.min;
        const max = box3.max;
        const x = point.x - object.position.x;
        const z = point.z - object.position.z;
        const pointBox3 = new THREE.Box3(
            new THREE.Vector3(min.x + x, min.y, min.z + z),
            new THREE.Vector3(max.x + x, max.y, max.z + z),
        );
        return collideWithBox(object, pointBox3);
    }

    return {
        isColliding,
        isCollidingAt,
    }
}
