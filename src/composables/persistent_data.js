import PersistentData from 'frontend-persistent-data';
import { ref } from 'vue';

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

export default {
    set,
    get,
    remove,
}
