import GameStats from 'game-stats'
import PersistentData from '../composables/persistent_data.js';
import { useManager } from './manager.js';
import { ref } from 'vue'

const stat = ref(null)
const controller = ref(null)
const isInitialized = ref(false)

const statName = 'general'
const maxLevel = 100
const experienceMultiplier = 1.2
const experienceFirstLevel = 100

/**
 * Manager methods.
 * Will be called by the manager.
 */
useManager().create('stats', {
    init: {
        priority: 1, // Must be lower than objectives.js
        callback: async (options) => {
            if (isInitialized.value) return false
    
            const s = GameStats.Stat.create(
                statName,
                maxLevel,
                experienceMultiplier,
                experienceFirstLevel,
                (options) => { },
                (options) => { }
            )
    
            controller.value = GameStats.Controller.create()
    
            if (!controller.value.findByName(statName)) {
                const statPD = await PersistentData.get(statName)
                const level = statPD?.level || 1
                const experience = statPD?.experience || 10
                controller.value.add(s, level, experience)
                stat.value = controller.value.findByName(statName)
            }
    
            isInitialized.value = true;
        }
    }
})

export function useStats() {

    const addExperience = async (experience) => {
        controller.value.addExperience(statName, experience)

        const stat = controller.value.findByName(statName)
        await PersistentData.set(statName, {
            level: stat.level,
            experience: stat.experience
        })
    }

    return {
        stat,
        addExperience,
    }
}