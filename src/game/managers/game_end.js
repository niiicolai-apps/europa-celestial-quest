import { ref } from 'vue';
import { usePlayers } from '../players/player.js';
import PersistentData from '../persistent_data/persistent_data.js';

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

    const endGame = async (state='win') => {
        if (Object.values(END_STATES).indexOf(state) === -1) {
            throw new Error(`Invalid game end state: ${state}`);
        }

        endState.value = state;

        /**
         * Reset persistent data.
         */
        PersistentData.resetMap();  
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
    const endGameCheck = async () => {
        const players = usePlayers();
        const you = players.findYou();
        if (you.isDead()) {
            await endGame(END_STATES.LOSE);
            return;
        }
    
        const aliveComputerPlayers = players.findAll(false, true, false);
        if (aliveComputerPlayers.length === 0) {
            await endGame(END_STATES.WIN);
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
