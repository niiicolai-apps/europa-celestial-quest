<template>
    <Panel :name="localizationManager.getLocale('shop.title')" identifier="shop">
        <UI.Paragraph class="mb-5">Body</UI.Paragraph>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Panel from '../../UI/Panel.vue';
import { useLocalization } from '../../../composables/localization.js';

const localizationManager = useLocalization();
</script>