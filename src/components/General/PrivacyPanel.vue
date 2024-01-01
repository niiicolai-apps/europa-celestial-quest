<template>
    <Panel :name="localizationManager.getLocale('privacy.title')" identifier="privacy">


        <UI.Flex>
            <div class="border-1 border-solid border-primary rounded p-3 box-shadow-lg w-full">
                <UI.Flex direction="horizontal" justify="start" gap="2">
                    <p class="text-xs">
                        <Locale id="privacy.published.label" />:
                        <Locale id="privacy.published.date" />
                    </p>

                    <p class="text-xs">
                        <Locale id="privacy.updated.label" />: 
                        <Locale id="privacy.updated.date" />
                    </p>
                </UI.Flex>
            </div>

            <div class="border-1 border-solid border-primary rounded p-3 box-shadow-lg w-full" v-for="section in sections"
                :key="section.name">
                <UI.Paragraph class="font-bold uppercase mb-1">
                    {{ section.title }}
                </UI.Paragraph>

                <p class="text-sm">
                    {{ section.content }}
                </p>
            </div>
        </UI.Flex>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Panel from '../UI/Panel.vue';
import Locale from './Locale.vue';
import { computed } from 'vue';
import { useLocalization } from '../../composables/localization';
const localizationManager = useLocalization();
const sections = computed(() => {
    return [{
        title: localizationManager.getLocale('privacy.data_collection_title'),
        content: localizationManager.getLocale('privacy.data_collection_content'),
    }, {
        title: localizationManager.getLocale('privacy.data_usage_title'),
        content: localizationManager.getLocale('privacy.data_usage_content'),
    }, {
        title: localizationManager.getLocale('privacy.data_storage_title'),
        content: localizationManager.getLocale('privacy.data_storage_content'),
    }, {
        title: localizationManager.getLocale('privacy.data_sharing_title'),
        content: localizationManager.getLocale('privacy.data_sharing_content'),
    }, {
        title: localizationManager.getLocale('privacy.coppa_title'),
        content: localizationManager.getLocale('privacy.coppa_content'),
    }, {
        title: localizationManager.getLocale('privacy.gdpr_title'),
        content: localizationManager.getLocale('privacy.gdpr_content'),
    }, {
        title: localizationManager.getLocale('privacy.changes_title'),
        content: localizationManager.getLocale('privacy.changes_content'),
    }]
})
</script>