<template>
    <div v-if="stat">
        <UI.Flex
            gap="2"
            :title="localizationManager.getLocale(`stats.${stat.name}`)"
            >

            <UI.ProgressBar 
                :progress="stat.experience" 
                :maxProgress="stat.maxExperience()"
                class="w-25 h-2 border-1 border-solid border-primary mt-1" 
                :showPercent="false"
                bg_color="bg-dark"
                bar_color="bg-warning"
            >
                <UI.Flex 
                    direction="horizontal" 
                    justify="between"
                    gap="1" 
                    class="text-white w-full px-1"
                    style="font-size: 0.6em;"
                    >
                    <UI.Flex direction="horizontal" justify="start" gap="1">
                        <Icons.fa.MedalIcon 
                            :width="iconSize" 
                            :height="iconSize" 
                            :fill="iconFill"
                        />
                        <p><Locale :id="`stats.${stat.name}`" /></p>
                    </UI.Flex>
                    <span>{{ stat.level }}</span>
                </UI.Flex>
            </UI.ProgressBar>
        </UI.Flex>
    </div>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../../General/Locale.vue';
import { computed } from 'vue';
import { useStats } from '../../../game/stats/stats.js';
import { useLocalization } from '../../../composables/localization.js';

const iconSize = "1em";
const iconFill = "white";

const localizationManager = useLocalization();
const statsManager = useStats();
const stat = computed(() => statsManager.findStatYou());
</script>