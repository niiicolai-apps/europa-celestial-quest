import PersistentData from '../game/persistent_data/persistent_data.js'
import { TimelineFromJson } from '../game/timelines/timeline.js'
import { useAudio } from './audio.js'
import { useSubTitle } from './sub_title.js'
import { useCanvas } from './canvas.js'
import { useMap } from '../game/map/map.js'
import { ref } from 'vue'

const camera = ref(null)
const scene = ref(null)

const audioCtrl1 = ref(null)
const audioCtrl2 = ref(null)
const subTitleCtrl = ref(null)

const onBefore = ref(null)
const onStop = ref(null)
const showTransition = ref(false)

const isInitialized = ref(false)
const timeline = ref(null)

export const useTimeline = () => {

    const init = (_onBefore, _onStop) => {
        if (isInitialized.value) return

        const audio = useAudio()
        const audioControllers = audio.getAll();
        if (audioControllers.length < 2) throw new Error('AudioControllers not found')

        const canvas = useCanvas()
        const canvasAdapter = canvas.adapter.value
        if (!canvasAdapter) throw new Error('CanvasAdapter not found')

        camera.value = canvasAdapter.camera 
        scene.value = canvasAdapter.scene
        audioCtrl1.value = audioControllers[0]
        audioCtrl2.value = audioControllers[1]
        subTitleCtrl.value = useSubTitle()
        onBefore.value = _onBefore
        onStop.value = _onStop
        isInitialized.value = true
    }
    
    const play = async (name) => {
        await onBefore.value()

        const response = await fetch(`timelines/${name}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load timeline: ${name}`);
        }

        const json = await response.json();
        timeline.value = await TimelineFromJson(
            json, 
            camera.value, 
            scene.value, 
            audioCtrl1.value, 
            audioCtrl2.value, 
            subTitleCtrl.value, 
            async () => {
                timeline.value = null

                /* Save the timeline to persistent data */
                const mapName = await useMap().name()
                const pdPrefix = `${mapName}-timelines`
                const timelines = await PersistentData.get(pdPrefix) || []
                const exists = timelines.find(t => t === name)
                if (!exists) PersistentData.set(pdPrefix, [...timelines, name])

                await onStop.value()
            }
        )
        
        timeline.value.play()
    }

    const stop = () => {
        if (!timeline.value) return
        timeline.value.stop()
    }

    const isPlaying = () => {
        if (!timeline.value) return false
        return timeline.value.isPlaying()
    }

    return {
        init,
        play,
        stop,
        isPlaying,
        showTransition
    }
}
