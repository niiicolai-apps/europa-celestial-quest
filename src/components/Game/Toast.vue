<template>
    <Transition name="slide-right">
        <UI.Fixed bottom="auto" left="auto" top="0" right="0" v-if="item" style="z-index: 10001; margin-top: 4.5em;">
            <div class="p-3 rounded box-shadow-lg mr-2" :class="bg[item.type]">
                <p class="text-primary font-bold text-center text-xs w-full">
                    <Locale :id="item.localeId" />
                </p>
            </div>
        </UI.Fixed>
    </Transition>
</template>

<script setup>
import UI from 'frontend-ui';
import { computed, defineExpose, onMounted, onUnmounted } from 'vue';
import Locale from '../General/Locale.vue';
import { useToast } from '../../composables/toast.js';

const toast = useToast();
const item = computed(() => toast.item.value);
const bg = {
    primary: 'bg-primary',
    success: 'bg-success',
    info: 'bg-info',
    warning: 'bg-warning',
    danger: 'bg-danger',
};

onMounted(() => {
    toast.enable();
});

onUnmounted(() => {
    toast.disable();
});

defineExpose({ add: toast.add });
</script>