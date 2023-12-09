<template>
    <Panel :name="localizationManager.getLocale('shop.title')" identifier="shop">
        <UI.Grid columns="3">
            <div 
                v-for="definition in definitions" 
                :key="definition.name"
                @click="click(definition)"
                class="border-1 border-solid border-primary w-full h-50 p-3 bg-secondary-hover cursor-pointer">      
                <div class="font-bold text-lg text-center mb-3">
                    <Locale :id="`constructions.${definition.name}`" />
                </div>          
                <img :src="definition.image" :alt="definition.name" 
                    class="block w-35 h-25 mx-auto" />
                <div>
                    <UI.Flex 
                        v-for="cost in definition.costs"
                        :key="cost.currency"
                        gap="3" 
                        direction="horizontal" 
                        justify="between" 
                        class="w-full text-sm">
                        <div class="capitalize font-bold">{{ cost.currency }}</div>
                        <div>{{ cost.amount }}</div>
                    </UI.Flex>
                </div>
            </div>
        </UI.Grid>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Panel from '../../UI/Panel.vue';
import Locale from '../../Locale.vue';
import { useLocalization } from '../../../composables/localization.js';
import { useItems } from '../../../composables/constructions.js';
import { useInspect } from '../../../composables/inspect.js';
import { usePanel } from '../../../composables/panel';
import { computed } from 'vue';

const localizationManager = useLocalization();
const inspectManager = useInspect();
const panelManager = usePanel();
const itemsManager = useItems();
const definitions = computed(() => itemsManager.ConstructionDefinitions);
const click = async (definition) => {
    console.log(definition);
    if (itemsManager.canAfford(definition.costs)) {
        const item = await itemsManager.spawn(definition);
        inspectManager.addSelectable(item);
        inspectManager.setSelected(item);
        panelManager.clearPanel();
    }
}
</script>