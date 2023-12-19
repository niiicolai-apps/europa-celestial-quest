<template>
    <div v-if="stat">
        <UI.Flex
            gap="2"
            :title="localizationManager.getLocale(`stats.${stat.name}`)"
            >

            <UI.ProgressBar 
                :progress="stat.experience" 
                :maxProgress="stat.maxExperience()"
                class="w-20 h-2 border-1 border-solid border-primary" 
                :showPercent="false"
                bg_color="bg-dark"
                bar_color="bg-warning"
            >
                <UI.Flex 
                    direction="horizontal" 
                    justify="between"
                    gap="1" 
                    class="text-white uppercase font-bold text-right w-full px-1"
                    style="font-size: .6em;"
                    >
                    
                    <Icons.fa.MedalIcon 
                        :width="iconSize" 
                        :height="iconSize" 
                        :fill="iconFill" 
                    />

                    <span >{{ stat.level }}</span>
                </UI.Flex>
            </UI.ProgressBar>
        </UI.Flex>
    </div>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import { computed } from 'vue';
import { useStats } from '../../../game/stats/stats.js';
import { useLocalization } from '../../../composables/localization.js';

const iconSize = "1em";
const iconFill = "white";

const localizationManager = useLocalization();
const statsManager = useStats();
const stat = computed(() => statsManager.findStatYou());
</script>