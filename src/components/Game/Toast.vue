<template>
    <UI.Fixed bottom="auto" left="3" top="3" right="3">
        <Transition name="slide-down">
            <div v-if="item">
                <UI.Card :type="item.type">
                    <template #body>
                        <p class="text-white font-bold text-center w-full">
                            <Locale :id="item.localeId" />     
                        </p>
                    </template>
                </UI.Card>
            </div>
        </Transition>
    </UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui';
import { ref, defineExpose, onMounted, onUnmounted } from 'vue';
import Locale from '../Locale.vue';

const queue = ref([]);
const item = ref(null);
const interval = ref(null);

const add = (localeId, time=5000, type='primary') => {
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

onMounted(() => {
    interval.value = setInterval(intervalMethod, 1000);
});

onUnmounted(() => {
    clearInterval(interval.value);
});

defineExpose({ add });
</script>