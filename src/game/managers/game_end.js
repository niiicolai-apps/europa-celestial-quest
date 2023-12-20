import { ref } from 'vue';
import { usePlayers } from '../players/player.js';

const END_STATES = {
    WIN: 'win',
    LOSE: 'lose',
};

const endState = ref(null);

export const useGameEnd = () => {

    const isGameEnded = () => {
        return endState.value !== null;
    }

    const isGameWon = () => {
        return endState.value === END_STATES.WIN;
    }

    const isGameLost = () => {
        return endState.value === END_STATES.LOSE;
    }

    const endGame = (state='win') => {
        if (Object.values(END_STATES).indexOf(state) === -1) {
            throw new Error(`Invalid game end state: ${state}`);
        }

        endState.value = state;
    }

    const reset = () => {
        endState.value = null;
    }    

    /**
     * Check if the game is ended.
     * Option 1) If all human players are dead, the game is lost.
     * Option 2) If all computer players are dead, the game is won.
     * Option 3) Nothing happens. 
     * @returns {void}
     */
    const endGameCheck = () => {
        const players = usePlayers();
        const aliveHumanPlayers = players.findAll(false, false);
        if (aliveHumanPlayers.length === 0) {
            //endState.value = END_STATES.LOSE;
            return;
        }
    
        const aliveComputerPlayers = players.findAll(false, true);
        if (aliveComputerPlayers.length === 0) {
            //endState.value = END_STATES.WIN;
        }
    }

    return {
        END_STATES,
        isGameEnded,
        isGameWon,
        isGameLost,
        endGame,
        endGameCheck,
        reset,
    }
}