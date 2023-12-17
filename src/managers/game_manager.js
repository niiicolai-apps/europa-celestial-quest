/**
 * Ensure manager is imported first.
 * Other managers must also be import to ensure
 * they are initialized.
 */
import { useManager } from './manager.js';
import './billboard.js';
import './state_machine.js';
import './constructions.js';
import './camera.js';
import './initializer.js';
import './ground.js';
import './map.js';
import './navigation.js';
import './objectives.js';
import './player.js';
import './resources.js';
import './stats.js';
import './units.js';
import './commands.js';
import './particles.js';

import { ref } from 'vue';
import { useTimeline } from '../composables/timeline.js';
import { useCanvas } from '../composables/canvas.js';
import { useMap } from './map.js';
import PersistentData from '../composables/persistent_data.js';

const timelineManager = useTimeline();
const endGame = ref(null);
const gameIsStarted = ref(false);

const gameLoop = ref(null);
const gameLoopInterval = 30;

export const useGameManager = () => {

    const init = async (_endGame) => {
        if (!endGame) throw new Error('EndGame is required');
        const onBeforeTimeline = async () => {
            await useManager().runMethod('onBeforeTimeline');
        }

        const onAfterTimeline = async () => {
            resumeGame();
            await useManager().runMethod('onAfterTimeline');
        }

        endGame.value = _endGame;
        timelineManager.init(onBeforeTimeline, onAfterTimeline);
    }

    const resumeGame = async () => {
        if (gameIsStarted.value) {
           
        } else {

            const mapName = await useMap().name();
            const timelines = await PersistentData.get(`${mapName}-timelines`) || [];
            const introExists = timelines.find(t => t === 'intro');
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