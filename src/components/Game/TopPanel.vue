<template>
    <UI.Fixed bottom="auto">
        <UI.Flex direction="horizontal" justify="between" class="bg-info box-shadow-lg p-3 border-b-1 border-solid border-primary">
            <BankAccounts />
            
            <UI.Flex direction="horizontal" gap="1">
                <UI.Flex gap="0">
                    <BankAccountBar name="power" />
                    <Stats />
                </UI.Flex>
            </UI.Flex>
        </UI.Flex>
        
    </UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui';
import BankAccounts from './Utils/BankAccounts.vue';
import BankAccountBar from './Utils/BankAccountBar.vue';
import Stats from './Utils/Stats.vue';
</script>