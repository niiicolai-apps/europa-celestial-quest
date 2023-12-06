<template>
    <UI.Fixed v-if="show" top="auto" bottom="3" left="3" right="3">
        <p v-if="localeId" class="text-white text-sm text-center mx-auto" style="max-width: 40em; line-height: 2em;">
            <Locale :id="localeId" />
        </p>
    </UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui';
import Locale from '../Locale.vue';
import { ref, defineExpose } from 'vue';

const show = ref(false);
const localeId = ref(null);

const showSubTitle = (id) => {
    localeId.value = id;
    show.value = true;
}

const hideSubTitle = () => {
    show.value = false;
}

defineExpose({ showSubTitle, hideSubTitle });
</script>