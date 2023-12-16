<template>
    <UI.Fixed class="bg-black p-3">
        <UI.Flex>
            <UI.Title class="text-info">
                C7Pixel
            </UI.Title>

            <UI.SubTitle class="text-secondary">
                <Locale id="main_menu.loading" />
            </UI.SubTitle>

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