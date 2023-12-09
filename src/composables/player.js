import { ref } from 'vue'
import { getMesh } from './meshes.js'
import { useItems } from './constructions.js'
import { useUnits } from './units.js'

const players = ref([])

const Player = (isComputer=false, teamName=null) => {
    if (!team) team = `team-${players.value.length + 1}`

    const spawnUnit = async (unitData) => {
        const mesh = await getMesh(unitData.mesh)
        if (!mesh) {
            throw new Error(`Mesh not found: ${unitData.mesh}`)
        }

        const units = useUnits()
        units.add(mesh, unitData, team)
        return mesh
    }

    const spawnConstruction = async (constructionData) => {
        const items = useItems()
        const isOwned = isComputer ? true : false
        return await items.spawn(constructionData, team, isOwned)
    }

    const setUnitsStateByPrimaryFunction = (stateName, primaryFunction='warrior') => {
        const units = useUnits()
        units.setStateByFunction(primaryFunction, stateName, team)
    }

    const isDead = () => {
        const units = useUnits()
        const constructions = useItems()
        const unitsCount = units.countByTeam(team)
        const constructionsCount = constructions.countByTeam(team)
        return unitsCount === 0 && constructionsCount === 0        
    }

    return {
        team,
        isComputer,
        spawnUnit,
        spawnConstruction,
        setUnitsStateByPrimaryFunction,
        isDead
    }
}

export const usePlayers = () => {

    const add = (isComputer=false, teamName=null) => {
        const player = Player(isComputer, teamName)
        
        players.value.push(player)
    }

    const get = (team) => {
        return players.value.find(p => p.team === team)
    }

    const remove = (team) => {
        const index = players.value.findIndex(p => p.team === team)
        if (index !== -1) {
            players.value.splice(index, 1)
        }
    }

    return {
        add,
        get,
        remove
    }
}
