<template>
    <div v-if="bank">
        <UI.Flex 
            gap="2" 
            v-for="account in filteredBankAccounts" 
            :key="account.name"
            :title="localizationManager.getLocale(`bank.${account.currency}`)"
            >
            <UI.ProgressBar 
                :progress="account.balance" 
                :maxProgress="account.max"
                class="w-20 h-2 border-1 border-solid border-primary" 
                :showPercent="false"
                bg_color="bg-dark"
                bar_color="bg-warning"
            >
                <UI.Flex direction="horizontal" justify="between" gap="1" class="w-full px-1">
                    <Icons.fa.BoltIcon 
                        v-if="name == 'power'" 
                        :width="iconSize" 
                        :height="iconSize" 
                        :fill="iconFill"
                    />
                    <UI.Flex class="text-white font-bold" style="font-size: .6em;">
                        
                        {{ parseInt(account.balance) }} / {{ account.max }}
                    </UI.Flex>
                </UI.Flex>
            </UI.ProgressBar>
        </UI.Flex>
    </div>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import { computed } from 'vue';
import { useBank } from '../../../managers/bank.js';
import { useLocalization } from '../../../composables/localization.js';

const props = defineProps({
    name: {
        type: String,
        required: true
    }
});
const iconSize = "0.6em";
const iconFill = "white";

const localizationManager = useLocalization();
const bankManager = useBank();

const bank = computed(() => bankManager.findYou());
const bankAccounts = computed(() => bank.value ? bank.value.accounts : []);
const filteredBankAccounts = computed(() => bankAccounts.value.filter(account => account.currency === props.name));
</script>
