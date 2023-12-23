<template>
    <Transition name="bounce">
        <UI.Fixed v-if="isGameStarted && isGameEnded" style="z-index: 1000;">
            <UI.Flex class="bg-dark text-center text-white">
                <UI.Title v-if="isGameWon">
                    <Locale id="game_end.you_win" />
                </UI.Title>
                <UI.Title v-else>
                    <Locale id="game_end.you_lost" />
                </UI.Title>

                <UI.Button @click="quit">
                    <Locale id="game_end.quit" />
                </UI.Button>
            </UI.Flex>
        </UI.Fixed>
    </Transition>
</template>

<script setup>
import UI from 'frontend-ui'
import Locale from '../General/Locale.vue';
import { computed } from 'vue'
import { useGameManager } from '../../game/managers/game_manager.js'
import { useGameEnd } from '../../game/managers/game_end.js'

const gameManager = useGameManager()
const gameEnd = useGameEnd()

const isGameStarted = computed(() => gameManager.isGameStarted())
const isGameEnded = computed(() => gameEnd.isGameEnded())
const isGameWon = computed(() => gameEnd.isGameWon())

const quit = () => {
    window.location.reload()
}
</script>