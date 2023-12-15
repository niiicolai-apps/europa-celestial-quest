<template>
    <audio 
        ref="audioRef" 
        class="hidden" 
    />
    <UI.Button 
        v-if="showMute && audioRef" 
        :type="muted ? 'primary' : 'danger'"
        @click="toggleMute">
        <Icons.fa.PlayIcon width="1em" height="1em" fill="white" v-if="muted" />
        <Icons.fa.StopIcon width="1em" height="1em" fill="white" v-else />
    </UI.Button>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import { useAudio } from '../../composables/audio.js';
import { ref, computed, onMounted, onUnmounted, defineExpose } from 'vue';

const props = defineProps({
    showMute: {
        type: Boolean,
        default: true
    }
});

const audioRef = ref(null);
const audioCtrl = ref(null);
const muted = computed(() => audioCtrl.value?.muted);
const toggleMute = () => audioCtrl.value?.toggleMute();
const audio = useAudio();

defineExpose( audioCtrl.value );

onMounted(() => {
    audioCtrl.value = audio.create(audioRef.value);
});

onUnmounted(() => {
    audio.destroy(audioCtrl.value);
});
</script>