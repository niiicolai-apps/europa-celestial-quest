<template>
    <Panel :name="localizationManager.getLocale('privacy.title')" identifier="privacy" :showScroll="true">
        <UI.Flex>
            <UI.Card v-for="section in sections" :key="section.name" class="w-full">
                <template #header>
                    <UI.Paragraph class="font-bold uppercase">
                        {{ section.title }}
                    </UI.Paragraph>
                </template>

                <template #body>
                    <UI.Paragraph>
                        {{ section.content }}
                    </UI.Paragraph>
                </template>

                <template #footer>
                    <UI.Flex direction="horizontal" class="text-xs text-dark">
                        <UI.Flex direction="horizontal" gap="1">
                            <Locale id="privacy.published" /> 
                            <span>{{ section.created_at }}</span>
                        </UI.Flex>
                        <UI.Flex direction="horizontal" gap="1">
                            <Locale id="privacy.updated" /> 
                            <span>{{ section.updated_at }}</span>
                        </UI.Flex>
                    </UI.Flex>
                </template>
            </UI.Card>
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
        created_at: "2023-11-17",
        updated_at: "2023-11-17",
    }, {
        title: localizationManager.getLocale('privacy.data_usage_title'),
        content: localizationManager.getLocale('privacy.data_usage_content'),
        created_at: "2023-11-17",
        updated_at: "2023-11-17",
    }, {
        title: localizationManager.getLocale('privacy.data_storage_title'),
        content: localizationManager.getLocale('privacy.data_storage_content'),
        created_at: "2023-11-17",
        updated_at: "2023-11-17",
    }, {
        title: localizationManager.getLocale('privacy.data_sharing_title'),
        content: localizationManager.getLocale('privacy.data_sharing_content'),
        created_at: "2023-11-17",
        updated_at: "2023-11-17",
    }]
})
</script>