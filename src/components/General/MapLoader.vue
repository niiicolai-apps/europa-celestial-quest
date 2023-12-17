<template>
    <UI.Fixed class="bg-black">
        <UI.Flex>
            <UI.Title class="text-info">
                <Locale id="map_loader.title" />
            </UI.Title>

            <UI.Paragraph class="text-secondary text-center">
                <Locale :id="'map_loader.tip' + tip" />
            </UI.Paragraph>

            <div>
                <Icons.fa.CircleNotchIcon class="spin" width="2em" height="2em" fill="#a2aebb" />
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
.spin {
    animation: spin .8s infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>