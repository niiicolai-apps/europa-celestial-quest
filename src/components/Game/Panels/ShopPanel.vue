<template>
    <Panel :name="localizationManager.getLocale('shop.title')" identifier="shop">
        <UI.Grid columns="2" gap="3">
            <ShopCard 
                v-for="definition in sortedDefinitions" 
                :key="definition.name"
                :definition="definition"
                :click="click"
                :isRequiredLevel="isRequiredLevel"
            />
        </UI.Grid>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Panel from '../../UI/Panel.vue';
import ShopCard from './ShopCard.vue';
import { useLocalization } from '../../../composables/localization.js';
import { useInspect } from '../../../game/inspect/inspect.js';
import { usePanel } from '../../../composables/panel.js';
import { usePlayers } from '../../../game/players/player.js';
import { useToast } from '../../../composables/toast.js';
import { useItems } from '../../../game/constructions/constructions.js';
import { computed } from 'vue';

const localizationManager = useLocalization();
const inspectManager = useInspect();
const panelManager = usePanel();
const playersManager = usePlayers();
const toastManager = useToast();
const itemsManager = useItems();

const sortDefinitionsByRequiredLevel = (definitions) => {
    return definitions.sort((a, b) => a.requiredLevel - b.requiredLevel);
}
const definitions = computed(() => itemsManager.ConstructionDefinitions);
const sortedDefinitions = computed(() => sortDefinitionsByRequiredLevel(definitions.value));

const you = computed(() => playersManager.findYou());
const stat = computed(() => you.value.getStat());

const isRequiredLevel = (definition) => {
    return definition.requiredLevel <= stat.value.level;
}

const click = async (definition) => {
    const bankController = you.value.bankController;
    
    if (!isRequiredLevel(definition)) return;

    if (!you.value.maxController.canSpawnOneMoreConstruction()) {
        toastManager.add('toasts.shop.max_constructions', 4000, 'danger');
        return 
    }
        
    if (bankController.canAfford(definition.costs)) {
        
        const construction = await you.value.spawnConstruction(definition.name);
        inspectManager.setSelected(construction.object3D);
        panelManager.clearPanel();
    } else {
        toastManager.add('toasts.shop.cannot_afford', 4000, 'danger');
    }
}
</script>