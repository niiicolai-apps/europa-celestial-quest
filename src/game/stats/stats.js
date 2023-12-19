import GameStats from 'game-stats'
import { useManager } from '../managers/manager.js';
import { usePlayers } from '../players/player.js';
import { ref } from 'vue'

const stat = ref(null)
const controllers = ref([])
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
    
            stat.value = GameStats.Stat.create(
                statName,
                maxLevel,
                experienceMultiplier,
                experienceFirstLevel,
                (options) => { },
                (options) => { }
            )
    
            isInitialized.value = true;
        }
    }
})

export function useStats() {

    const create = async (team, level=1, experience=10) => {
        const controller = GameStats.Controller.create()
        const extendedController = {
            controller,
            team
        }

        if (!controller.findByName(statName)) {
            controller.add(stat.value, level, experience)
        }

        controllers.value.push(extendedController)
    }

    const addExperience = async (team, experience) => {
        const extendedController = controllers.value.find(c => c.team === team)
        extendedController.controller.addExperience(statName, experience)
    }

    const findStat = (team) => {
        const extendedController = controllers.value.find(c => c.team === team)
        if (!extendedController) return null
        return extendedController.controller.findByName(statName)
    }

    const findStatYou = () => {
        const player = usePlayers().findYou()
        return findStat(player.team)
    }

    return {
        stat,
        create,
        addExperience,
        findStat,
        findStatYou
    }
}