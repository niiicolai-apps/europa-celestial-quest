import GameStats from 'game-stats'
import { ref } from 'vue'

const controller = ref(null)
const isInitialized = ref(false)

export function useStats(options = {}) {

    const init = () => {
        if (isInitialized.value) return

        const statName = 'general'
        const maxLevel = 100
        const experienceMultiplier = 1.2
        const experienceFirstLevel = 100
        const stat = GameStats.Stat.create(
            statName,
            maxLevel,
            experienceMultiplier,
            experienceFirstLevel,
            (options) => {},
            (options) => {}
        )

        controller.value = GameStats.Controller.create(options)

        if (!controller.value.findByName(statName)) {
            controller.value.add(stat)
        }

        isInitialized.value = true
    }

    return {
        init,
        controller
    }
}