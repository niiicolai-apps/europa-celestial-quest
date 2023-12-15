<template>
    <UI.Flex direction="horizontal" gap="2" v-if="isInitialized">
        <UI.Flex 
            gap="2" 
            v-for="account in filteredBankAccounts" 
            :key="account.name"
            :title="localizationManager.getLocale(`bank.${account.name}`)"
            >

            <Icons.fa.TrashIcon 
                v-if="account.name == 'ice'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <Icons.fa.TrashIcon 
                v-if="account.name == 'rock'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <Icons.fa.TrashIcon 
                v-if="account.name == 'hydrogen'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <Icons.fa.TrashIcon 
                v-if="account.name == 'metal'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <Icons.fa.ScrollIcon 
                v-if="account.name == 'research'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <div class="text-primary font-bold" style="font-size: .6em;">
                {{ balance(account) }}
            </div>
        </UI.Flex>
    </UI.Flex>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import { computed } from 'vue';
import { useBank } from '../../../composables/bank.js';
import { useLocalization } from '../../../composables/localization.js';

const iconSize = "0.8em";
const iconFill = "#1c3144";
const localizationManager = useLocalization();
const bankManager = useBank();
const isInitialized = computed(() => bankManager.isInitialized.value);
const bankAccounts = computed(() => bankManager.bank.value.accounts);
// filter out research and power accounts
const filteredBankAccounts = computed(() => bankAccounts.value.filter(account => 
    account.name !== 'power'));
const balance = (account) => {
    if (account.max) {
        return `${parseInt(account.balance)}/${account.max}`;
    }
    
    return account.balance;
}
</script>
