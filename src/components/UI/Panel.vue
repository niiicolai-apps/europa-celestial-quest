<template>
    <UI.Panel transition_name="slide-up" :show="selectedPanel === identifier">

        <div class="bg-info rounded w-full h-screen" :class="showScroll ? 'overflow-y-scroll' : ''">
            <UI.Fixed bottom="auto">
                <UI.Flex direction="horizontal" justify="start" gap="2" class="p-5 bg-info">

                    <UI.Button type="primary" 
                        class="flex items-center justify-center" 
                        @click="panelManager.clearPanel()">
                        <UI.Flex>
                            <Icons.fa.ArrowDownIcon 
                                width="1em" 
                                height="1em" 
                                fill="#3f88c5" 
                            />
                        </UI.Flex>
                    </UI.Button>

                    <UI.SubTitle class="uppercase text-primary">
                        {{ name }}
                    </UI.SubTitle>

                </UI.Flex>
            </UI.Fixed>
            
            <div class="px-5" style="margin-top: 4.35rem;">
                <slot />
            </div>
        </div>

    </UI.Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import { usePanel } from '../../composables/panel.js';
import { computed } from 'vue';

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
        default: false,
    },
})
const panelManager = usePanel();
const selectedPanel = computed(() => panelManager.selectedPanel.value);
</script>