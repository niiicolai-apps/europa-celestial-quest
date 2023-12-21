<template>
    <UI.Flex gap="2">
        <Icons.fa.SpaceAwesomeIcon :width="iconSize" :height="iconSize"
            :fill="iconFill" />

        <div class="text-primary font-bold text-center" style="font-size: .6em;">
            <p class="mb-1">
                <Locale id="max.constructions" />
            </p>
            <p>{{ constructionsCount }} / {{ constructionsMax }}</p>
        </div>
    </UI.Flex>

    <UI.Flex gap="2">
        <Icons.fa.UserAstronautIcon :width="iconSize" :height="iconSize"
            :fill="iconFill" />

        <div class="text-primary font-bold text-center" style="font-size: .6em;">
            <p class="mb-1">
                <Locale id="max.units" />
            </p>
            <p>{{ unitsCount }} / {{ constructionsMax }}</p>
        </div>
    </UI.Flex>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../../General/Locale.vue';
import { usePlayers } from '../../../game/players/player.js';
import { computed } from 'vue';

const iconSize = "0.8em";
const iconFill = "#1c3144";

const playersManager = usePlayers();

const player = computed(() => playersManager.findYou());
const maxController = computed(() => player.value.maxController);

const constructionsCount = computed(() => maxController.value.getConstructionsCount());
const constructionsMax = computed(() => maxController.value.constructions.max);
const unitsCount = computed(() => maxController.value.getUnitsCount());
const unitsMax = computed(() => maxController.value.units.max);
</script>