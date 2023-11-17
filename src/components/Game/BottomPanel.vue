<template>
    <Transition name="slide-up">
        <UI.Fixed v-if="!selected" top="auto" left="1" right="1" bottom="1">
            <UI.Flex direction="horizontal" justify="between" gap="1">

                <UI.Flex direction="horizontal" justify="start" gap="1">
                    <UI.Button 
                    :title="localizationManager.getLocale('game_menu.shop_button')"
                        @click="panelManager.setPanel('shop')"
                        >
                        <Icons.fa.ShopIcon 
                            width="2em" 
                            height="2em"
                            fill="white"
                        />
                    </UI.Button>

                    <UI.Button 
                        :title="localizationManager.getLocale('game_menu.objectives_button')" 
                        @click="panelManager.setPanel('objectives')"
                        >
                        <Icons.fa.ScrollIcon 
                            width="2em" 
                            height="2em"
                            fill="white"
                        />
                    </UI.Button>
                    
                    <UI.Button 
                        :title="localizationManager.getLocale('game_menu.pause_button')" 
                        @click="panelManager.setPanel('pause')"
                        >
                        <Icons.fa.PauseIcon 
                            width="2em" 
                            height="2em"
                            fill="white"
                        />
                    </UI.Button>
                </UI.Flex>
                
            </UI.Flex>
        </UI.Fixed>
    </Transition>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import { computed } from 'vue';
import { useInspect } from '../../composables/inspect.js';
import { useLocalization } from '../../composables/localization.js';
import { usePanel } from '../../composables/panel.js';
const panelManager = usePanel();
const localizationManager = useLocalization();
const inspectManager = useInspect();
const selected = computed(() => inspectManager.selected.value);
</script>