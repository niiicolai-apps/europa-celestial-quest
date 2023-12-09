import { ref } from 'vue';

const objects = ref([]);
const camera = ref(null);
const isInitialized = ref(false);
const interval = ref(null);

const loop = () => {
    if (!isInitialized.value) return;

    for (const object of objects.value) {
        object.lookAt(camera.value.position);
    }
}

export const useBillboard = () => {

    const init = async (_camera) => {
        if (isInitialized.value) return false;

        camera.value = _camera;
        isInitialized.value = true;
    }

    const add = (object3D) => {
        const exist = objects.value.find(o => o.uuid === object3D.uuid);
        if (exist) return;

        objects.value.push(object3D);
    }

    const remove = (object3D) => {
        objects.value = objects.value.filter(o => o.uuid !== object3D.uuid);
    }

    const enable = () => {
        interval.value = setInterval(loop, 1000);
    }

    const disable = () => {
        clearInterval(interval.value);
    }

    return {
        init,
        add,
        remove,
        enable,
        disable
    }
}
