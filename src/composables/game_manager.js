import { ref } from 'vue';
import { useTimeline } from './timeline.js';
import { useManager } from '../managers/manager.js';
import { useCanvas } from './canvas.js';

import PersistentData from './persistent_data.js';

const timelineManager = useTimeline();
const endGame = ref(null);
const gameIsStarted = ref(false);

const gameLoop = ref(null);
const gameLoopInterval = 30;

export const useGameManager = () => {

    const init = async (_endGame) => {
        if (!endGame) throw new Error('EndGame is required');
        endGame.value = _endGame;
        timelineManager.init(resumeGame);
    }

    const resumeGame = async () => {
        if (gameIsStarted.value) {
            console.log('Resuming game');
        } else {

            const timelines = await PersistentData.get('timelines') || [];
            const introExists = timelines.find(t => t === 'intro'); 
            console.log(timelines, introExists);        
            if (introExists) await startNewGame();
            else await timelineManager.play('intro');
        }
    }

    const startNewGame = async () => {
        if (gameIsStarted.value) return;

        const canvas = useCanvas();
        const adapter = canvas.adapter.value;
        const { lifeCycle } = adapter;

        /**
         * 1. Initialize managers.
         * 2. Enable managers.
         */
        await useManager().runMethod('init');
        await useManager().runMethod('enable');

        /**
         * 3. Initialize onAnimate methods
         */
        lifeCycle.onAnimate.push(async () => {
            await useManager().runMethod('onAnimate');
        });

        /**
         * 4. Initialize onDispose methods
         */
        lifeCycle.onDispose.push(async () => {
            await useManager().runMethod('disable');
            //disposeMeshCache();
        });

        /**
         * 5. Start game loop.
         */
        gameLoop.value = setInterval(async () => {
            await useManager().runMethod('update');
        }, gameLoopInterval);

        /**
         * 5. Set game as started.
         */
        gameIsStarted.value = true;
    }

    const isGameStarted = () => {
        return gameIsStarted.value;
    }

    const backToMainMenu = () => {
        endGame.value();
    }

    return {
        init,
        resumeGame,
        isGameStarted,
        backToMainMenu
    }
}