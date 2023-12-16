<template>
    <UI.Fixed class="bg-black">
        <UI.Flex>
            <UI.Title class="text-info">
                <Locale id="map_loader.title" />
            </UI.Title>

            <UI.Paragraph class="text-secondary text-center">
                <Locale :id="'map_loader.tip' + tip" />
            </UI.Paragraph>

            <div class="pulse">
                <Icons.fa.CrownIcon width="2em" height="2em" fill="#a2aebb" />
            </div>
        </UI.Flex>
    </UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from './Locale.vue';

const numberOfTips = 3;
const tip = Math.floor(Math.random() * numberOfTips) + 1;
</script>

<style scoped>
.pulse {
    animation: pulse .5s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}
</style>