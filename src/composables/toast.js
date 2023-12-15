import { ref } from 'vue';

const queue = ref([]);
const item = ref(null);
const interval = ref(null);

export const useToast = () => {
    const add = (localeId, time = 4000, type = 'info') => {
        const removeAt = Date.now() + time;
        queue.value.push({ localeId, type, removeAt });
    }
    
    const intervalMethod = () => {
        if (item.value) {
            const now = Date.now();
            if (item.value.removeAt < now) {
                item.value = null;
            } else {
                return;
            }
        }
    
        if (queue.value.length === 0) return;
    
        item.value = { ...queue.value.shift() };
    }

    const enable = () => {
        interval.value = setInterval(intervalMethod, 1000);
    }

    const disable = () => {
        clearInterval(interval.value);
    }

    return {
        item,
        add,
        enable,
        disable
    }
}
