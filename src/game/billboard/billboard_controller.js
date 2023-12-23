import { ref } from 'vue';
import BillboardModel from './billboard_model.js';

const billboards = ref([]);
const isPaused = ref(false);

/**
 * Find a billboard by object3D.
 * 
 * @param {Object3D} object3D
 * @returns {BillboardModel}
 * @public
 */
const find = (object3D) => {
    return billboards.value.find(b => b.uuid === object3D.uuid);
}

/**
 * Creates a billboard model.
 * 
 * @param {Object3D} object3D 
 * @returns {BillboardModel}
 * @public
 */
const create = (object3D, camera) => {
    const exist = find(object3D);
    if (exist) throw new Error('Billboard already exists');

    const billboardModel = BillboardModel(object3D, camera);

    billboards.value.push(billboardModel);

    return billboardModel;
}

/**
 * Remove a billboard model.
 * 
 * @param {Object3D} object3D
 * @returns {void}
 * @public
 */
const remove = (object3D) => {
    const billboard = find(object3D);
    if (!billboard) return;

    billboards.value = billboards.value.filter(b => b.uuid !== billboard.uuid);
}

/**
 * Updates the billboards
 * 
 * @returns {void}
 * @public
 */
const update = () => {
    if (isPaused.value) return;

    for (const billboard of billboards.value) {
        billboard.update();
    }
}

/**
 * Sets the billboard to paused.
 * 
 * @param {boolean} state
 * @returns {void}
 * @public
 */
const setPaused = (state) => {
    isPaused.value = state;
}

export default {
    billboards,
    isPaused,
    find,
    create,
    remove,
    update,
    setPaused,
}
