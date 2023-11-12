<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import WebGL from 'frontend-webgl';
import Locale from '../components/Locale.vue';
import SettingsPanel from '../components/SettingsPanel.vue';
import { setMeta } from '../composables/meta.js';
import { ref } from 'vue';

const selectedPanel = ref('');
const setPanel = (newPanel) => selectedPanel.value = newPanel;

setMeta("game")
</script>

<template>
    <WebGL.components.MatrixBgg class="fixed inset-0 w-full h-full" />
    
    <SettingsPanel
        :selectedPanel="selectedPanel"
        :setPanel="setPanel"
    />

</template>
