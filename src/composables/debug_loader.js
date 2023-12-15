import { ref } from 'vue'

const progress = ref(100)
const maxProgress = ref(100)
const title = ref('Debug Loader')
const description = ref('Loading...')

export const useDebugLoader = () => {

    const setProgress = (value) => {
        progress.value = value
    }
    
    const setMaxProgress = (value) => {
        maxProgress.value = value
    }
    
    const setDescription = (value) => {
        description.value = value
    }

    const setTitle = (value) => {
        title.value = value
    }

    const isComplete = () => {
        return progress.value >= maxProgress.value
    }

    const reset = () => {
        progress.value = 100
        maxProgress.value = 100
        title.value = 'Debug Loader'
        description.value = 'Loading...'
    }

    return {
        progress,
        maxProgress,
        description,
        setProgress,
        setMaxProgress,
        setDescription,
        isComplete,
        reset,
        title,
        setTitle
    }
}
