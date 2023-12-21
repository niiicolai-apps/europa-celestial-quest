<script setup>
import UI from 'frontend-ui';
import Locale from './General/Locale.vue';
import Agree from './UI/Agree.vue';
import { defineEmits } from 'vue';

const emits = defineEmits(['acceptLicens']);
const accept = () => emits('acceptLicens');
</script>

<template>
    <Agree title_locale_id="software_licens.title" 
        loading_locale_id="software_licens.loading"
        requirements_locale_id="software_licens.requirements" 
        published_label_locale_id="software_licens.published.label"
        published_date_locale_id="software_licens.published.date" 
        updated_label_locale_id="software_licens.updated.label"
        updated_date_locale_id="software_licens.updated.date"
        new_modifications_locale_id="software_licens.new_modifications"
        accept_button_locale_id="software_licens.accept_button" 
        persistent_data_key="software_licens"
        :accept="accept">

        <p class="text-xs mb-5">
            <Locale id="software_licens.start" />
        </p>

        <div class="text-xs mb-5">
            <p class="font-bold mb-2">
                <Locale id="software_licens.definitions.title" />
            </p>
            <UI.Flex gap="2" items="start" class="ml-3 w-full">
                <p>
                    <Locale id="software_licens.definitions.item_1" />
                </p>
                <p>
                    <Locale id="software_licens.definitions.item_2" />
                </p>
            </UI.Flex>
        </div>

        <div class="text-xs mb-5">
            <p class="font-bold mb-2">
                <Locale id="software_licens.license_grant.title" />
            </p>
            <UI.Flex gap="2" items="start" class="ml-3 w-full">
                <p>
                    <Locale id="software_licens.license_grant.item_1" />
                </p>
                <p>
                    <Locale id="software_licens.license_grant.item_2" />
                </p>
            </UI.Flex>
        </div>

        <div class="text-xs mb-5">
            <p class="font-bold mb-2">
                <Locale id="software_licens.restrictions.title" />
            </p>
            <UI.Flex gap="2" items="start" class="ml-3 w-full">
                <p>
                    <Locale id="software_licens.restrictions.item_1" />
                </p>
                <p>
                    <Locale id="software_licens.restrictions.item_2" />
                </p>
                <p>
                    <Locale id="software_licens.restrictions.item_3" />
                </p>
            </UI.Flex>
        </div>

        <div class="text-xs mb-5">
            <p class="font-bold mb-2">
                <Locale id="software_licens.intellectual_property.title" />
            </p>
            <UI.Flex gap="2" items="start" class="ml-3 w-full">
                <p>
                    <Locale id="software_licens.intellectual_property.item_1" />
                </p>
                <p>
                    <Locale id="software_licens.intellectual_property.item_2" />
                </p>
            </UI.Flex>
        </div>

        <div class="text-xs mb-5">
            <p class="font-bold mb-2">
                <Locale id="software_licens.disclaimer_of_property.title" />
            </p>
            <UI.Flex gap="2" items="start" class="ml-3 w-full">
                <p>
                    <Locale id="software_licens.disclaimer_of_property.item_1" />
                </p>
            </UI.Flex>
        </div>

        <div class="text-xs mb-5">
            <p class="font-bold mb-2">
                <Locale id="software_licens.limitation_of_liability.title" />
            </p>
            <UI.Flex gap="2" items="start" class="ml-3 w-full">
                <p>
                    <Locale id="software_licens.limitation_of_liability.item_1" />
                </p>
            </UI.Flex>
        </div>

        <div class="text-xs mb-5">
            <p class="font-bold mb-2">
                <Locale id="software_licens.termination.title" />
            </p>
            <UI.Flex gap="2" items="start" class="ml-3 w-full">
                <p>
                    <Locale id="software_licens.termination.item_1" />
                </p>
                <p>
                    <Locale id="software_licens.termination.item_2" />
                </p>
            </UI.Flex>
        </div>

        <div class="text-xs mb-5">
            <p class="font-bold mb-2">
                <Locale id="software_licens.miscellaneous.title" />
            </p>
            <UI.Flex gap="2" items="start" class="ml-3 w-full">
                <p>
                    <Locale id="software_licens.miscellaneous.item_1" />
                </p>
                <p>
                    <Locale id="software_licens.miscellaneous.item_2" />
                </p>
                <p>
                    <Locale id="software_licens.miscellaneous.item_3" />
                </p>
                <p>
                    <Locale id="software_licens.miscellaneous.item_4" />
                </p>
            </UI.Flex>
        </div>

        <p class="font-bold text-xs mb-5">
            <Locale id="software_licens.ending" />
        </p>

    </Agree>
</template>
