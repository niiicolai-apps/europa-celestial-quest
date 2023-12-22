<template>
    <UI.Flex direction="horizontal" gap="2" v-if="bank">
        <UI.Flex 
            gap="2" 
            v-for="account in filteredBankAccounts" 
            :key="account.currency"
            :title="localizationManager.getLocale(`bank.${account.currency}`)"
            >

            <Icons.fa.IciclesIcon 
                v-if="account.currency == 'ice'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <Icons.fa.HillRockSlideIcon 
                v-if="account.currency == 'rock'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <Icons.fa.AtomIcon 
                v-if="account.currency == 'hydrogen'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <Icons.fa.RingIcon 
                v-if="account.currency == 'metal'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <Icons.fa.SatelliteDishIcon 
                v-if="account.currency == 'research'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <div class="text-primary font-bold text-center accounts-text">
                <p class="mb-1"><Locale :id="`bank.${account.currency}`" /></p>
                <p>{{ balance(account) }}</p>
            </div>
        </UI.Flex>
    </UI.Flex>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../../General/Locale.vue';
import { computed } from 'vue';
import { useBank } from '../../../game/bank/bank.js';
import { useLocalization } from '../../../composables/localization.js';

const iconSize = "0.8em";
const iconFill = "#1c3144";

const localizationManager = useLocalization();
const bankManager = useBank();

const bank = computed(() => bankManager.findYou());
const bankAccounts = computed(() => bank.value ? bank.value.accounts : []);
const filteredBankAccounts = computed(() => bankAccounts.value.filter(account => account.currency !== 'power'));

const balance = (account) => {
    if (account.max) {
        return `${parseInt(account.balance)}/${account.max}`;
    }
    
    return account.balance;
}
</script>

<style scoped>
.accounts-text {
    font-size: 0.57em;
}
</style>