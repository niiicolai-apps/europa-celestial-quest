<template>
    <Panel :name="localizationManager.getLocale('software_licens.title')" identifier="licens">
        
        <UI.Flex class="mt-5">
            <div class="border-1 border-solid border-primary p-3 rounded box-shadow-lg w-full">
                <UI.Flex direction="horizontal" justify="start" gap="2">
                    <p class="text-xs">
                        <Locale id="software_licens.published.label" />:
                        <Locale id="software_licens.published.date" />
                    </p>

                    <p class="text-xs">
                        <Locale id="software_licens.updated.label" />: 
                        <Locale id="software_licens.updated.date" />
                    </p>
                </UI.Flex>
            </div>

            <div class="border-1 border-solid border-primary p-3 rounded box-shadow-lg w-full">
                <p class="text-xs">
                    <Locale id="software_licens.start" />
                </p> 
            </div>

            <div v-for="section in sections" :key="section.name" class="w-full border-1 border-solid border-primary p-3 rounded box-shadow-lg">
                <UI.Paragraph class="font-bold uppercase mb-3">
                    {{ section.title }}
                </UI.Paragraph>

                <ul>
                    <li v-for="item in section.items" :key="item" class="mb-1">
                        <p class="text-xs">
                            {{ item }}
                        </p>
                    </li>
                </ul>
            </div>

            <div class="border-1 border-solid border-primary p-3 rounded box-shadow-lg">
                <p class="text-xs">
                    <Locale id="software_licens.ending" />
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
        title: localizationManager.getLocale('software_licens.definitions.title'),
        items: [
            localizationManager.getLocale('software_licens.definitions.item_1'),
            localizationManager.getLocale('software_licens.definitions.item_2'),
        ],
    }, {
        title: localizationManager.getLocale('software_licens.license_grant.title'),
        items: [
            localizationManager.getLocale('software_licens.license_grant.item_1'),
            localizationManager.getLocale('software_licens.license_grant.item_2'),
        ],
    }, {
        title: localizationManager.getLocale('software_licens.restrictions.title'),
        items: [
            localizationManager.getLocale('software_licens.restrictions.item_1'),
            localizationManager.getLocale('software_licens.restrictions.item_2'),
            localizationManager.getLocale('software_licens.restrictions.item_3')
        ],
    }, {
        title: localizationManager.getLocale('software_licens.intellectual_property.title'),
        items: [
            localizationManager.getLocale('software_licens.intellectual_property.item_1'),
            localizationManager.getLocale('software_licens.intellectual_property.item_2')
        ],
    }, {
        title: localizationManager.getLocale('software_licens.disclaimer_of_property.title'),
        items: [
            localizationManager.getLocale('software_licens.disclaimer_of_property.item_1')
        ],
    }, {
        title: localizationManager.getLocale('software_licens.limitation_of_liability.title'),
        items: [
            localizationManager.getLocale('software_licens.limitation_of_liability.item_1')
        ],
    }, {
        title: localizationManager.getLocale('software_licens.termination.title'),
        items: [
            localizationManager.getLocale('software_licens.termination.item_1'),
            localizationManager.getLocale('software_licens.termination.item_2'),
        ],
    }, {
        title: localizationManager.getLocale('software_licens.miscellaneous.title'),
        items: [
            localizationManager.getLocale('software_licens.miscellaneous.item_1'),
            localizationManager.getLocale('software_licens.miscellaneous.item_2'),
            localizationManager.getLocale('software_licens.miscellaneous.item_3'),
            localizationManager.getLocale('software_licens.miscellaneous.item_4'),
        ],
    }]
})
</script>