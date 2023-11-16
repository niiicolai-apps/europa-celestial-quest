<template>
    <UI.Flex direction="horizontal" gap="3" v-if="bank">
        <UI.Flex gap="2" v-for="account in bank.accounts" :key="account.name">
            <Icons.fa.CoinsIcon 
                v-if="account.name == 'coins'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <Icons.fa.GemIcon 
                v-if="account.name == 'diamonds'" 
                :width="iconSize" 
                :height="iconSize" 
                :fill="iconFill" 
            />

            <UI.Paragraph class="text-white">
                {{ account.balance }}
            </UI.Paragraph>
        </UI.Flex>
    </UI.Flex>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import { computed } from 'vue';
import { useBank } from '../../../composables/bank.js';

const iconSize = "1em";
const iconFill = "white";
const bankManager = useBank();
const bank = computed(() => bankManager.bank.value);
</script>
