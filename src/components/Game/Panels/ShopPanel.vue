<template>
    <Panel :name="localizationManager.getLocale('shop.title')" identifier="shop">
        <UI.Grid columns="3">
            <div 
                v-for="definition in definitions" 
                :key="definition.name"
                @click="click(definition)"
                class="border-1 border-solid border-primary w-30 h-30 p-3">                
                <img :src="definition.image" :alt="definition.name" 
                    class="block w-20 h-15 mx-auto" />
                <div>
                    <UI.Flex 
                        v-for="cost in definition.costs"
                        :key="cost.currency"
                        gap="1" 
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
import { useLocalization } from '../../../composables/localization.js';
import { useItems } from '../../../composables/items.js';
import { useInspect } from '../../../composables/inspect.js';
import { usePanel } from '../../../composables/panel';
import { computed } from 'vue';

const localizationManager = useLocalization();
const inspectManager = useInspect();
const panelManager = usePanel();
const itemsManager = useItems();
const definitions = computed(() => itemsManager.itemDefinitions);
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