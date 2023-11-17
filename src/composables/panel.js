import { ref } from 'vue'

const selectedPanel = ref('');

export const usePanel = () => {

    const setPanel = (newPanel) => {
        if (!newPanel) throw new Error('Panel must be defined');
        if (newPanel.length === 0) throw new Error('Panel must must be longer than 0 characters');
        if (selectedPanel.value === newPanel) return;

        selectedPanel.value = newPanel;
    }

    const clearPanel = () => {
        selectedPanel.value = '';
    }

    return {
        setPanel,
        clearPanel,
        selectedPanel
    }
}
