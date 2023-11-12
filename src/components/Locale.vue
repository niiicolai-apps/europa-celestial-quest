<template>
    {{ getLocale(id) }}
</template>

<script setup>
import { useLocalization } from '../composables/localization.js';
const { getLocale } = useLocalization();
defineProps({
    id: {
        type: String,
        required: true
    }
})
</script>
