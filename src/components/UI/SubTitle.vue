<template>
    <UI.Fixed v-if="show" top="auto" bottom="3" left="3" right="3">
        <p v-if="localeId" class="text-white text-sm text-center mx-auto" style="max-width: 40em; line-height: 2em;">
            <Locale :id="localeId" />
        </p>
    </UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui';
import Locale from '../General/Locale.vue';
import { computed } from 'vue';
import { useSubTitle } from '../../composables/sub_title.js';

const subTitleManager = useSubTitle();
const show = computed(() => subTitleManager.show.value);
const localeId = computed(() => subTitleManager.localeId.value);

</script>