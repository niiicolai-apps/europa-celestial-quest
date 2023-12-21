<script setup>
import UI from 'frontend-ui';
import Locale from './General/Locale.vue';
import Agree from './UI/Agree.vue';
import { defineEmits } from 'vue';

const emits = defineEmits(['acceptPrivacy']);
const accept = () => emits('acceptPrivacy');
</script>

<template>
    <Agree title_locale_id="privacy.title" 
        loading_locale_id="privacy.loading"
        requirements_locale_id="privacy.requirements" 
        published_label_locale_id="privacy.published.label"
        published_date_locale_id="privacy.published.date" 
        updated_label_locale_id="privacy.updated.label"
        updated_date_locale_id="privacy.updated.date"
        new_modifications_locale_id="privacy.new_modifications"
        accept_button_locale_id="privacy.accept_button" 
        persistent_data_key="privacy_policy"
        :accept="accept">

        <div class="text-xs mb-5">
                    <p class="font-bold mb-2">
                        <Locale id="privacy.data_collection_title" />
                    </p>
                    <UI.Flex gap="2" items="start" class="ml-3 w-full">
                        <p>
                            <Locale id="privacy.data_collection_content" />
                        </p>
                    </UI.Flex>
                </div>

                <div class="text-xs mb-5">
                    <p class="font-bold mb-2">
                        <Locale id="privacy.data_usage_title" />
                    </p>
                    <UI.Flex gap="2" items="start" class="ml-3 w-full">
                        <p>
                            <Locale id="privacy.data_usage_content" />
                        </p>
                    </UI.Flex>
                </div>

                <div class="text-xs mb-5">
                    <p class="font-bold mb-2">
                        <Locale id="privacy.data_storage_title" />
                    </p>
                    <UI.Flex gap="2" items="start" class="ml-3 w-full">
                        <p>
                            <Locale id="privacy.data_storage_content" />
                        </p>
                    </UI.Flex>
                </div>

                <div class="text-xs mb-5">
                    <p class="font-bold mb-2">
                        <Locale id="privacy.data_sharing_title" />
                    </p>
                    <UI.Flex gap="2" items="start" class="ml-3 w-full">
                        <p>
                            <Locale id="privacy.data_sharing_content" />
                        </p>
                    </UI.Flex>
                </div>

    </Agree>
</template>
