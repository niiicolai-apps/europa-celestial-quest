<template>
    <UI.Fixed bottom="auto" left="1" right="1" top="1">
        <UI.Flex direction="horizontal" justify="between">
            <BankAccounts />

            <UI.ProgressBar 
                :progress="20" 
                :maxProgress="100" 
                class="w-32 h-12 rounded" 
            />
        </UI.Flex>
    </UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui';
import BankAccounts from './BankAccounts.vue';
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