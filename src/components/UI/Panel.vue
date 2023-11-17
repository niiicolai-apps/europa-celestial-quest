<template>
    <UI.Panel transition_name="slide-up" :show="selectedPanel === identifier">

        <div class="bg-white rounded w-full h-screen" :class="showScroll ? 'overflow-y-scroll' : ''">
            <UI.Fixed bottom="auto" class="h-15">
                <UI.Flex direction="horizontal" justify="start" class="p-5 bg-primary">

                    <UI.Button type="secondary" class="flex items-center justify-center" @click="panelManager.clearPanel()">
                        <UI.Flex>
                            <Icons.fa.ArrowDownIcon 
                                width="1em" 
                                height="1em" 
                                fill="white" 
                            />
                        </UI.Flex>
                    </UI.Button>

                    <UI.SubTitle class="uppercase text-white">
                        {{ name }}
                    </UI.SubTitle>

                </UI.Flex>
            </UI.Fixed>
            
            <div class="p-5" style="margin-top: 3.75rem;">
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