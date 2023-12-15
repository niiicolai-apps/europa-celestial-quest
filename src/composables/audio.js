import { ref } from 'vue';

const audioControllers = ref([]);

const AudioController = (audioRef) => {
    if (!audioRef) throw new Error('AudioRef is required');
    audioRef.muted = true;
    const muted = ref(true);

    const play = () => audioRef.play();
    
    const pause = () => audioRef.pause();
    
    const toggle = () => audioRef.paused ? play() : pause();
    
    const setVolume = (volume) => audioRef.volume = volume;
    
    const setSrc = (src) => audioRef.src = src;
    
    const toggleMute = () => {
        if (audioRef.paused) audioRef.play();
        audioRef.muted = !audioRef.muted;
        muted.value = audioRef.muted;
    }

    const setMuted = (value) => {
        audioRef.muted = value;
        muted.value = value;
    }

    return {
        play,
        pause,
        toggle,
        setVolume,
        setSrc,
        toggleMute,
        setMuted,
        muted,
    }
}

export const useAudio = () => {
    
    const create = (audioRef) => {
        const controller = AudioController(audioRef);
        audioControllers.value.push(controller);
        return controller;
    }

    const destroy = (controller) => {
        const index = audioControllers.value.findIndex(c => c === controller);
        if (index === -1) throw new Error('AudioController not found');
        audioControllers.value.splice(index, 1);
    }

    const get = (index=0) => {
        if (!audioControllers.value[index]) 
            throw new Error('AudioController not found');
        
        return audioControllers.value[index];
    }

    const getAll = () => {
        return audioControllers.value;
    }

    return {
        create,
        destroy,
        get,
        getAll,
    }
}
