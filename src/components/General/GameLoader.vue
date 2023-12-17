<template>
    <UI.Fixed class="bg-black p-3">
        <UI.Flex>
            <UI.Title class="text-info">
                C7Pixel
            </UI.Title>

            <UI.SubTitle class="text-secondary">
                <Locale id="main_menu.loading" />
            </UI.SubTitle>

            <div >
                <Icons.fa.CircleNotchIcon class="spin" width="2em" height="2em" fill="#a2aebb" />
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