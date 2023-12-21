<template>
    <DebugLoader />
    
    <SoftwareLicens @acceptLicens="acceptLicens" v-if="showLicens" />
    <PrivacyPolicy @acceptPrivacy="acceptPrivacy" v-if="showPrivacy" />
    <MainMenu @startGame="startGame" v-if="showMenu" />
    <Game @endGame="endGame" v-if="showGame" />
</template>

<script setup>
import DebugLoader from '../components/General/DebugLoader.vue';
import MainMenu from '../components/MainMenu.vue';
import Game from '../components/Game.vue';
import SoftwareLicens from '../components/SoftwareLicens.vue';
import PrivacyPolicy from '../components/PrivacyPolicy.vue';
import { ref, computed } from 'vue';

const acceptedLicens = ref(false);
const acceptedPrivacy = ref(false);
const isGameStarted = ref(false);

const startGame = () => isGameStarted.value = true;
const endGame = () => isGameStarted.value = false;

const acceptLicens = () => acceptedLicens.value = true;
const acceptPrivacy = () => acceptedPrivacy.value = true;
const declinePrivacy = () => acceptedPrivacy.value = false;
const declineLicens = () => acceptedLicens.value = false;

const showLicens = computed(() => !acceptedLicens.value);
const showPrivacy = computed(() => acceptedLicens.value && !acceptedPrivacy.value);
const showMenu = computed(() => acceptedPrivacy.value && acceptedLicens.value && !isGameStarted.value);
const showGame = computed(() => acceptedPrivacy.value && acceptedLicens.value && isGameStarted.value);
</script>
