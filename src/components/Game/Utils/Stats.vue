<template>
    <div v-if="statsCtrl && stats">
        <UI.Flex 
            v-for="stat in stats" 
            :key="stat.name" 
            gap="2"
            :title="localizationManager.getLocale(`stats.${stat.name}`)"
            >

            <UI.ProgressBar 
                :progress="stat.experience" 
                :maxProgress="stat.maxExperience()" 
                class="w-32 h-6 rounded" 
                :showPercent="false"
            >
                <UI.Flex 
                    direction="horizontal" 
                    justify="center"
                    gap="1" 
                    class="text-white uppercase font-bold text-right w-full"
                    >
                    
                    <span>Lvl</span>
                    <span>{{ stat.level }}</span>
                </UI.Flex>
            </UI.ProgressBar>
        </UI.Flex>
    </div>
</template>

<script setup>
import UI from 'frontend-ui';
import { computed } from 'vue';
import { useStats } from '../../../composables/stats.js';
import { useLocalization } from '../../../composables/localization.js';

const localizationManager = useLocalization();
const statsManager = useStats();
const statsCtrl = computed(() => statsManager.controller.value);
const stats = computed(() => statsCtrl.value.stats);
</script>