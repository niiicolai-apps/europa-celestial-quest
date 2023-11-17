<template>
    <UI.Panel transition_name="slide-up" :show="selectedPanel === identifier">
        <div class="bg-white rounded w-full h-screen">
            <div class="p-5 bg-primary flex items-center justify-start gap-3">
                <UI.Button type="danger" class="flex items-center justify-center" @click="panelManager.clearPanel()">
                    <Icons.fa.ArrowDownIcon width="1em" height="1em" fill="white" />
                </UI.Button>
                <UI.SubTitle class="uppercase text-white">
                    {{ name }}
                </UI.SubTitle>
            </div>
            
            <div class="p-5">
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
})
const panelManager = usePanel();
const selectedPanel = computed(() => panelManager.selectedPanel.value);
</script>