<template>
    <UI.Fixed class="bg-black p-5">
        <UI.Flex class="mx-auto text-center">
            <UI.SubTitle class="text-warning">
                <Locale :id="titleLocaleId" />
            </UI.SubTitle>

            <p class="text-secondary font-bold uppercase">
                <Locale :id="descriptionLocaleId" />
            </p>

            <div >
                <Icons.fa.CircleNotchIcon class="spin" width="2em" height="2em" fill="#a2aebb" />
            </div>
        </UI.Flex>
    </UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../General/Locale.vue';
defineProps({
    titleLocaleId: {
        type: String,
        required: true
    },
    descriptionLocaleId: {
        type: String,
        required: true
    }
})
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