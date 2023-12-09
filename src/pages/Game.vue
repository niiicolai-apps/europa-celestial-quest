<template>
    <MainMenu @startGame="isGameStarted = true" v-if="!isGameStarted" />
    <Game @endGame="isGameStarted = false" v-else />
</template>

<script setup>
import MainMenu from '../components/MainMenu.vue';
import Game from '../components/Game.vue';
import { ref } from 'vue';

const isGameStarted = ref(false);
</script>
