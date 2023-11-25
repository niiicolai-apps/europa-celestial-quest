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
import { ref, computed, onMounted, defineExpose } from 'vue';

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    volume: {
        type: Number,
        default: 1
    },
    showMute: {
        type: Boolean,
        default: true
    }
});

const audioRef = ref(null);
const muted = ref(false);

const play = () => audioRef.value.play();
const pause = () => audioRef.value.pause();
const toggle = () => audioRef.value.paused ? play() : pause();
const setVolume = (volume) => audioRef.value.volume = volume;
const setSrc = (src) => audioRef.value.src = src;
const toggleMute = () => {
    if (audioRef.value.paused) audioRef.value.play();
    audioRef.value.muted = !audioRef.value.muted;
    muted.value = audioRef.value.muted;
}

defineExpose({
    play,
    pause,
    toggle,
    setVolume,
    setSrc,
    toggleMute
});

onMounted(() => {
    setVolume(props.volume);
    setSrc(props.src);
    audioRef.value.muted = true;
    muted.value = true;
});
</script>