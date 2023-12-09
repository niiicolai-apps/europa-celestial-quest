import PersistentData from './persistent_data.js'
import { TimelineFromJson } from './timelines/timeline.js'
import { ref } from 'vue'

const camera = ref(null)
const scene = ref(null)
const audioCtrl1 = ref(null)
const audioCtrl2 = ref(null)
const subTitleCtrl = ref(null)
const onStop = ref(null)
const isInitialized = ref(false)
const timeline = ref(null)

export const useTimeline = () => {

    const init = (_camera, _scene, _audioCtrl1, _audioCtrl2, _subTitleCtrl, _onStop) => {
        if (isInitialized.value) return

        camera.value = _camera
        scene.value = _scene
        audioCtrl1.value = _audioCtrl1
        audioCtrl2.value = _audioCtrl2
        subTitleCtrl.value = _subTitleCtrl
        onStop.value = _onStop
        isInitialized.value = true
    }
    
    const play = async (name, _onStop=onStop.value) => {
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
                const timelines = await PersistentData.get('timelines') || []
                const exists = timelines.find(t => t === name)
                if (!exists) PersistentData.set('timelines', [...timelines, name])

                _onStop()
            }
        )
        console.log(timeline.value)
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
        isPlaying
    }
}
