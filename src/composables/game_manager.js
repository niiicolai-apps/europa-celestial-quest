import { ref } from 'vue';
import { useBank } from './bank.js';
import { useObjectives } from './objectives.js';
import { useStats } from './stats.js';
import { useInspect } from './inspect.js';
import { disposeMeshCache } from './meshes.js';
import { useGround } from './ground.js';
import { useItems } from './constructions.js';
import { useNavigation } from './navigation.js';
import { useUnits } from './units.js';
import { useResources } from './resources.js';
import { useMap } from './map.js';
import { useEnemy } from './enemy.js';
import { useBillboard } from './billboard.js';
import { useStateMachine } from './state_machine.js';
import { useTimeline } from './timeline.js';

import PersistentData from './persistent_data.js';
import Camera from './camera.js';

const objectivesManager = useObjectives({});
const statsManager = useStats();
const bankManager = useBank();
const inspectManager = useInspect();
const groundManager = useGround();
const itemsManager = useItems();
const navigationManager = useNavigation();
const unitsManager = useUnits();
const resourcesManager = useResources();
const mapManager = useMap();
const enemyManager = useEnemy();
const billboardManager = useBillboard();
const stateMachineManager = useStateMachine();
const timelineManager = useTimeline();
const props = ref({});

const webGLOptions = {
    camera: { ...Camera.options },
};

export const useGameManager = () => {

    const init = async (canvasAdapter, audio1Ctrl, audio2Ctrl, subTitleCtrl, toastCtrl) => {
        if (!canvasAdapter) throw new Error('CanvasAdapter is required');
        if (!audio1Ctrl) throw new Error('Audio1Ctrl is required');
        if (!audio2Ctrl) throw new Error('Audio2Ctrl is required');
        if (!subTitleCtrl) throw new Error('SubTitleCtrl is required');
        if (!toastCtrl) throw new Error('ToastCtrl is required');
        
        props.value = {
            canvasAdapter,
            audio1Ctrl,
            audio2Ctrl,
            subTitleCtrl,
            toastCtrl,
            gameIsStarted: false,
        };

        timelineManager.init(
            canvasAdapter.camera,
            canvasAdapter.scene,
            audio1Ctrl,
            audio2Ctrl,
            subTitleCtrl,
            resumeGame
        );
    }

    const resumeGame = async () => {
        if (props.value.gameIsStarted) {
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
        if (props.value.gameIsStarted) return;
        props.value.gameIsStarted = true;

        const { renderer, camera, scene, lifeCycle } = props.value.canvasAdapter;
        const domElement = renderer.domElement;

        Camera.manager.enable();
        inspectManager.enable(camera, scene, renderer);
        navigationManager.enable();

        await mapManager.init(scene);
        await objectivesManager.init();
        await bankManager.init();
        await statsManager.init();
        await itemsManager.init(scene);
        await unitsManager.init(scene, domElement);
        await resourcesManager.init(scene);
        await enemyManager.init(scene);
        await billboardManager.init(camera);
        await groundManager.init(
            scene, 
            camera, 
            domElement, 
            lifeCycle
        );
    
        groundManager.enable();
        unitsManager.enable();
        billboardManager.enable();
        itemsManager.enable();
        stateMachineManager.enable();

        lifeCycle.onAnimate.push(() => {
            Camera.manager.update();
        });

        lifeCycle.onDispose.push(() => {
            Camera.manager.disable();
            inspectManager.disable();
            navigationManager.disable();
            groundManager.disable();
            unitsManager.disable();
            stateMachineManager.disable();
            disposeMeshCache();
        });
    }

    const isGameStarted = () => {
        return props.value.gameIsStarted;
    }

    return {
        init,
        resumeGame,
        isGameStarted,
    }
}