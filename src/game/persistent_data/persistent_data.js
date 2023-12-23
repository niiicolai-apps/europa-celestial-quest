import PersistentData from 'frontend-persistent-data';
import { useMap } from '../map/map.js';

let name = null;
const pd = PersistentData.usePersistentData();
pd.setAdapter(pd.ADAPTERS.LOCAL_STORAGE);

const set = async (key, value) => {
    pd.set(key, value);
}

const get = async (key) => {
    return await pd.get(key);
}

const remove = async (key) => {
    pd.remove(key);
}

const setPlayers = async (players) => {
    if (!name) name = await useMap().name();
    await set(`${name}-players`, players);
}

const getPlayers = async () => {
    if (!name) name = await useMap().name();
    return get(`${name}-players`);
}

const setTimelines = async (timelines) => {
    if (!name) name = await useMap().name();
    await set(`${name}-timelines`, timelines);
}

const getTimelines = async () => {
    if (!name) name = await useMap().name();
    return await get(`${name}-timelines`);
}

const setCompletedObjectives = async (completedObjectives) => {
    if (!name) name = await useMap().name();
    await set(`${name}-completed_objectives`, completedObjectives);
}

const getCompletedObjectives = async () => {
    if (!name) name = await useMap().name();
    return await get(`${name}-completed_objectives`);
}

const resetMap = async () => {
    if (!name) name = await useMap().name();
    await remove(`${name}-timelines`);
    await remove(`${name}-players`);
    await remove(`${name}-completed_objectives`);
}

export default {
    set,
    get,
    remove,
    resetMap,
    setPlayers,
    getPlayers,
    setTimelines,
    getTimelines,
    setCompletedObjectives,
    getCompletedObjectives
}
