<template>
    <DebugLoader />
    
    <MainMenu @startGame="startGame" v-if="!isGameStarted" />
    <Game @endGame="endGame" v-else />
</template>

<script setup>
import DebugLoader from '../components/General/DebugLoader.vue';
import MainMenu from '../components/MainMenu.vue';
import Game from '../components/Game.vue';
import { ref } from 'vue';

const isGameStarted = ref(false);
const startGame = () => isGameStarted.value = true;
const endGame = () => isGameStarted.value = false;
</script>
