<template>
    <UI.Fixed bottom="auto" left="1" right="1" top="1">
        <UI.Flex direction="horizontal" justify="between">
            <BankAccounts />
            <Stats />
        </UI.Flex>
    </UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui';
import BankAccounts from './Utils/BankAccounts.vue';
import Stats from './Utils/Stats.vue';
defineProps({
    selectedPanel: {
        type: String,
        required: true,
    },
    setPanel: {
        type: Function,
        required: true,
    },
})
</script>