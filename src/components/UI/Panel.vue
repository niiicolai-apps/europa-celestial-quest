<template>
    <UI.Panel transition_name="slide-up" :show="selectedPanel === identifier">

        <div class="bg-info rounded w-full h-screen" :style="showScroll ? 'overflow-y:auto;' : ''">
            <UI.Fixed bottom="auto" class="top-panel">
                <UI.Flex direction="horizontal" justify="start" gap="3" 
                    class="p-5 bg-info box-shadow-lg border-b-1 border-solid border-primary h-18">

                    <UI.Button type="primary" 
                        class="flex items-center justify-center" 
                        @click="panelManager.clearPanel()">
                        <UI.Flex gap="1">
                            <Icons.fa.ArrowDownIcon 
                                :width="iconSize" 
                                :height="iconSize" 
                                :fill="iconFill" 
                            />

                            <p class="text-info uppercase font-bold top-panel-btn-text">
                                <Locale id="game_menu.close_button" />
                            </p>
                        </UI.Flex>
                    </UI.Button>

                    <UI.SubTitle class="uppercase text-primary">
                        {{ name }}
                    </UI.SubTitle>

                </UI.Flex>
            </UI.Fixed>

            <div class="h-18"></div>
            <div class="p-5">
                <slot />
            </div>
        </div>

    </UI.Panel>
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
    showScroll: {
        type: Boolean,
        default: true,
    },
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

</style>