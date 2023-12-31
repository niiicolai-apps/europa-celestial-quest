import { ref } from 'vue';
import PersistentData from '../game/persistent_data/persistent_data.js';
import { useManager } from '../game/managers/manager.js';
import { useMap } from '../game/map/map.js';

const tutorialName = ref(null);
const tutorials = ref([]);
const tutorialIndex = ref(-1);
const tutorial = ref(null);
const timeout = ref(null);
const delay = 500;

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('tutorials', {
    init: {
        priority: 1,
        callback: async () => {
            const map = useMap();
            const mapTutorials = await map.tutorials();
            const startTutorial = mapTutorials.start_tutorial;
            await useTutorial().set(startTutorial.name, startTutorial.items);
        }
    }
})

export const useTutorial = () => {

    const hasPlayedBefore = async (name) => {
        const pdTutorials = await PersistentData.get('tutorials');
        if (!pdTutorials) return false;
        return pdTutorials.includes(name);
    }

    const addToPlayed = async (name) => {
        let pdTutorials = await PersistentData.get('tutorials');
        if (!pdTutorials) {
            pdTutorials = [];
        }

        pdTutorials.push(name);

        await PersistentData.set('tutorials', pdTutorials);
    }

    const removeFromPlayed = async (name) => {
        let pdTutorials = await PersistentData.get('tutorials');
        if (!pdTutorials) {
            pdTutorials = [];
        }

        pdTutorials = pdTutorials.filter(t => t !== name);
        // Remove nulls
        pdTutorials = pdTutorials.filter(t => t);

        await PersistentData.set('tutorials', pdTutorials);
    }

    const set = async (name, items=[]) => {
        if (await hasPlayedBefore(name)) return;
        tutorialName.value = name;
        tutorials.value = items;
        playNext();
    }

    const playNext = () => {
        if (timeout.value) clearTimeout(timeout.value);
        tutorial.value = null;
        timeout.value = setTimeout(() => {
            tutorialIndex.value++;
            tutorial.value = tutorials.value[tutorialIndex.value];
            timeout.value = null;
        }, delay);
    }

    const delayPrevious = () => {
        if (timeout.value) clearTimeout(timeout.value);
        
        tutorial.value = null;
        timeout.value = setTimeout(() => {
            if (tutorialIndex.value >= tutorials.value.length) return;
            tutorialIndex.value--;
            tutorial.value = tutorials.value[tutorialIndex.value];
            timeout.value = null;
        }, delay);
    }

    const clear = async () => {
        if (timeout.value) return;
        if (stepsLeft() === 0) {
            clearAll();
        } else {
            playNext();
        }
    }

    const clearAll = async () => {
        await addToPlayed(tutorialName.value);
        tutorialIndex.value = -1;
        tutorial.value = null;
        tutorials.value = [];
        timeout.value = null;
    }

    const replay = async (name) => {
        const map = useMap();
        const mapTutorials = await map.tutorials();
        const tutorial = mapTutorials[name];
        if (!tutorial) throw new Error('Tutorial not found');
        await removeFromPlayed(tutorial.name);
        await set(tutorial.name, tutorial.items);
    }

    const isPlaying = () => {
        return tutorials.value.length > 0;
    }

    const stepsLeft = () => {
        return tutorials.value.length - (tutorialIndex.value + 1);
    }

    const totalSteps = () => {
        return tutorials.value.length;
    }
        
    return {
        tutorial,
        set,
        delayPrevious,
        clear,
        clearAll,
        isPlaying,
        stepsLeft,
        totalSteps,
        replay
    }
}
