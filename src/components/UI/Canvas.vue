<template>
    <WebGL.components.Canvas3D 
        ref="canvasRef" 
        :options="options" 
        class="w-full h-screen block" 
    />
</template>

<script setup>
import WebGL from 'frontend-webgl';
import { useCanvas } from '../../composables/canvas.js';
import { ref, computed, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
const canvas = useCanvas();
const options = computed(() => canvas.webGLOptions);

onMounted(async () => {
    canvas.enable(canvasRef.value);
})

onUnmounted(() => {
    canvas.disable();
})
</script>