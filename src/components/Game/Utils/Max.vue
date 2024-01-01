<template>
    <UI.Flex direction="horizontal" justify="start" v-if="player">
        <UI.Flex direction="horizontal" justify="start" gap="2">
            <Icons.fa.SpaceAwesomeIcon :width="iconSize" :height="iconSize"
                :fill="iconFill" />

            <div class="text-primary font-bold text-center" style="font-size: .6em;">
                <Locale id="max.constructions" />
            </div>

            <p class="text-primary font-bold text-center" style="font-size: .6em;">
                    {{ constructionsCount }} / {{ constructionsMax }}
            </p>
        </UI.Flex>

        <UI.Flex direction="horizontal" justify="start" gap="2">
            <Icons.fa.UserAstronautIcon :width="iconSize" :height="iconSize"
                :fill="iconFill" />

            <div class="text-primary font-bold text-center" style="font-size: .6em;">
                <Locale id="max.units" />
            </div>

            <p class="text-primary font-bold text-center" style="font-size: .6em;">
                {{ unitsCount }} / {{ constructionsMax }}
            </p>
        </UI.Flex>
    </UI.Flex>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../../General/Locale.vue';
import { usePlayers } from '../../../game/players/player.js';
import { computed } from 'vue';

const iconSize = "0.6em";
const iconFill = "#1c3144";

const playersManager = usePlayers();

const player = computed(() => playersManager.findYou());
const maxController = computed(() => player.value ? player.value.maxController : {});

const constructionsCount = computed(() => maxController.value.getConstructionsCount());
const constructionsMax = computed(() => maxController.value.constructions?.max);
const unitsCount = computed(() => maxController.value.getUnitsCount());
</script>