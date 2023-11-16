<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import WebGL from 'frontend-webgl';

import { useBank } from '../composables/bank.js';
import { useObjectives } from '../composables/objectives.js';

import Locale from '../components/Locale.vue';

import SettingsPanel from '../components/SettingsPanel.vue';
import ObjectivesPanel from '../components/Game/Panels/ObjectivesPanel.vue';
import ShopPanel from '../components/Game/Panels/ShopPanel.vue';

import TopPanel from '../components/Game/TopPanel.vue';
import BottomPanel from '../components/Game/BottomPanel.vue';
import { setMeta } from '../composables/meta.js';
import { ref, computed } from 'vue';

// # UI
const selectedPanel = ref('');
const setPanel = (newPanel) => selectedPanel.value = newPanel;

// # Dummy data
const player = ref({
    name: 'Player',
    experience: 0,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
});

const objectivesManager = useObjectives(player);
objectivesManager.init();

const bankManager = useBank();
bankManager.init();

setMeta("game")
</script>

<template>
    <WebGL.components.MatrixBgg class="fixed inset-0 w-full h-full" />

    <TopPanel :selectedPanel="selectedPanel" :setPanel="setPanel" />
    <BottomPanel :selectedPanel="selectedPanel" :setPanel="setPanel" />

    <SettingsPanel :selectedPanel="selectedPanel" :setPanel="setPanel" />
    <ObjectivesPanel :objectivesManager="objectivesManager" :selectedPanel="selectedPanel" :setPanel="setPanel" />
    <ShopPanel :selectedPanel="selectedPanel" :setPanel="setPanel" />
</template>
