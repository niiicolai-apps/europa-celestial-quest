<template>
    <Panel :name="localizationManager.getLocale('shop.title')" identifier="shop">
        <UI.Grid columns="3" gap="3">
            <div 
                v-for="definition in definitions" 
                :key="definition.name"
                @click="click(definition)"
                class="bg-primary border-1 border-solid border-primary rounded w-full p-1 bg-primary-hover cursor-pointer box-shadow-lg">   

                <UI.Flex direction="horizontal" gap="3" class="p-1 mb-1  h-12">
                    <UI.Flex class="font-bold text-info text-xs text-left upperca w-15">
                        <Locale :id="`constructions.${definition.name}`" />
                    </UI.Flex>  

                    <UI.Flex class="bg-info w-15 h-full rounded">
                        <img 
                            :src="definition.image" 
                            :alt="definition.name" 
                            class="block rounded w-5 rounded mx-auto" 
                        />
                    </UI.Flex>
                </UI.Flex>

                <UI.Flex direction="horizontal" class="h-10">
                    <UI.Flex 
                        v-for="cost in definition.costs"
                        :key="cost.currency"
                        gap="2" 
                        class="text-xs text-info">
                        <Icons.fa.TrashIcon 
                            v-if="cost.currency == 'metal'" 
                            :width="iconSize" 
                            :height="iconSize" 
                            :fill="iconFill"
                        />
                        <Icons.fa.TrashIcon 
                            v-if="cost.currency == 'ice'" 
                            :width="iconSize" 
                            :height="iconSize" 
                            :fill="iconFill"
                        />
                        <Icons.fa.TrashIcon 
                            v-if="cost.currency == 'hydrogen'" 
                            :width="iconSize" 
                            :height="iconSize" 
                            :fill="iconFill"
                        />
                        <Icons.fa.TrashIcon 
                            v-if="cost.currency == 'rock'" 
                            :width="iconSize" 
                            :height="iconSize" 
                            :fill="iconFill"
                        />
                        <div>{{ cost.amount }}</div>
                    </UI.Flex>
                </UI.Flex>
            </div>
        </UI.Grid>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Panel from '../../UI/Panel.vue';
import Locale from '../../General/Locale.vue';
import { useLocalization } from '../../../composables/localization.js';
import { useItems } from '../../../managers/constructions.js';
import { useInspect } from '../../../managers/inspect.js';
import { usePanel } from '../../../composables/panel.js';
import { usePlayers } from '../../../managers/player.js';
import { useToast } from '../../../composables/toast.js';
import { computed } from 'vue';

const localizationManager = useLocalization();
const inspectManager = useInspect();
const panelManager = usePanel();
const itemsManager = useItems();
const playersManager = usePlayers();
const toastManager = useToast();

const definitions = computed(() => itemsManager.ConstructionDefinitions);
const iconSize = "0.8em";
const iconFill = "#3f88c5";

const click = async (definition) => {
    
    if (itemsManager.canAfford(definition.costs)) {
        const player = playersManager.get('player');
        const construction = await player.spawnConstruction(definition.name);
        inspectManager.addSelectable(construction);
        inspectManager.setSelected(construction);
        panelManager.clearPanel();
    } else {
        toastManager.add('toasts.shop.cannot_afford', 4000, 'danger');
    }
}
</script>