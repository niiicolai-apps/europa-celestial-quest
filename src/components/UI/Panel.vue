<template>
    <Transition :name="transition_name">
        <div class="fixed left-0 right-0 bottom-0 z-1000 flex items-center justify-center" :style="styling"
            v-if="selectedPanel === identifier">
            <div class="bg-info w-full h-screen overflow-y-auto relative">
                <div class="fixed left-0 right-0 bottom-auto top-panel" :style="styling_top">
                    <UI.Flex direction="horizontal" justify="start" gap="3"
                        class="p-5 bg-info box-shadow-lg border-b-1 border-solid border-primary h-18">

                        <UI.Button type="primary" class="flex items-center justify-center"
                            @click="panelManager.clearPanel()">
                            <UI.Flex gap="1">
                                <Icons.fa.ArrowDownIcon :width="iconSize" :height="iconSize" :fill="iconFill" />

                                <p class="text-info uppercase font-bold top-panel-btn-text">
                                    <Locale id="game_menu.close_button" />
                                </p>
                            </UI.Flex>
                        </UI.Button>

                        <UI.SubTitle class="uppercase text-primary">
                            {{ name }}
                        </UI.SubTitle>

                    </UI.Flex>
                </div>

                <div class="h-18"></div>
                <div class="p-5">
                    <slot />
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../General/Locale.vue';
import { usePanel } from '../../composables/panel.js';
import { computed } from 'vue';

const iconSize = "1em";
const iconFill = "#3f88c5";

defineProps({
    name: {
        type: String,
        required: true,
    },
    identifier: {
        type: String,
        required: true,
    },
    styling: {
        type: Object,
        default: () => {
            return {
                top: "0"
            }
        }
    },
    styling_top: {
        type: String,
        default: 'top: 0;'
    },
    transition_name: {
        type: String,
        default: "slide-up"
    }
})
const panelManager = usePanel();
const selectedPanel = computed(() => panelManager.selectedPanel.value);
</script>

<style scoped>
.top-panel {
    z-index: 1;
}

.top-panel-btn-text {
    font-size: 0.7em;
}

.slide-up-game-enter-active,
.slide-up-game-leave-active {
  transition: transform 0;
}

.slide-up-game-enter-from,
.slide-up-game-leave-to {
  transform: translateY(200%);
}
</style>