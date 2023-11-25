import GameStats from 'game-stats'
import PersistentData from './persistent_data.js';
import { ref } from 'vue'

const stat = ref(null)
const controller = ref(null)
const isInitialized = ref(false)

const statName = 'general'
const maxLevel = 100
const experienceMultiplier = 1.2
const experienceFirstLevel = 100

export function useStats(options = {}) {

    const init = async () => {
        if (isInitialized.value) return

        const s = GameStats.Stat.create(
            statName,
            maxLevel,
            experienceMultiplier,
            experienceFirstLevel,
            (options) => { },
            (options) => { }
        )

        controller.value = GameStats.Controller.create(options)

        if (!controller.value.findByName(statName)) {
            const statPD = await PersistentData.get(statName)
            const level = statPD?.level || 1
            const experience = statPD?.experience || 10
            controller.value.add(s, level, experience)
            stat.value = controller.value.findByName(statName)
        }

        isInitialized.value = true
    }

    const addExperience = async (experience) => {
        controller.value.addExperience(statName, experience)

        const stat = controller.value.findByName(statName)
        await PersistentData.set(statName, {
            level: stat.level,
            experience: stat.experience
        })
    }

    return {
        init,
        stat,
        addExperience,
    }
}