<template>
    <Panel :name="localizationManager.getLocale('shop.title')" identifier="shop">
        <UI.Grid columns="2" gap="3">
            <div 
                v-for="definition in definitions" 
                :key="definition.name"
                @click="click(definition)"
                class="bg-info text-primary border-1 border-solid border-primary rounded w-full p-2 bg-info-hover cursor-pointer box-shadow-lg">   

                <UI.Flex direction="horizontal" justify="between" items="start" gap="3" class="text-xs mb-1 h-28">
                    <div>
                        <p class="font-bold uppercase mb-1">
                            <Locale :id="`constructions.${definition.name}.title`" />
                        </p>
                        <p style="font-size: .9em;">
                            <Locale :id="`constructions.${definition.name}.description`" />
                        </p>
                    </div>  

                    <div>
                        <UI.Flex class="bg-primary w-10 h-10 rounded">
                            <img 
                                :src="definition.image" 
                                :alt="definition.name" 
                                class="block rounded w-7 rounded mx-auto" 
                            />
                        </UI.Flex>
                    </div>
                </UI.Flex>

                <UI.Flex direction="horizontal" class="h-13 text-info bg-primary rounded">
                    <UI.Flex 
                        v-for="cost in definition.costs"
                        :key="cost.currency"
                        gap="1" 
                        class="text-xs w-4">
                        <div class="mt-1">
                            <Icons.fa.RingIcon 
                                v-if="cost.currency == 'metal'" 
                                :width="iconSize" 
                                :height="iconSize" 
                                :fill="iconFill"
                            />
                            <Icons.fa.IciclesIcon 
                                v-if="cost.currency == 'ice'" 
                                :width="iconSize" 
                                :height="iconSize" 
                                :fill="iconFill"
                            />
                            <Icons.fa.AtomIcon 
                                v-if="cost.currency == 'hydrogen'" 
                                :width="iconSize" 
                                :height="iconSize" 
                                :fill="iconFill"
                            />
                            <Icons.fa.HillRockSlideIcon 
                                v-if="cost.currency == 'rock'" 
                                :width="iconSize" 
                                :height="iconSize" 
                                :fill="iconFill"
                            />
                        </div>
                        <div class="text-center font-bold mb-1" style="font-size: .7em;">
                            <p class="mb-1"><Locale :id="`bank.${cost.currency}`" /></p>
                            <p>{{ cost.amount }}</p>
                        </div>
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

const definitions = computed(() => itemsManager.ConstructionDefinitions);
const iconSize = "0.8em";
const iconFill = "#3f88c5";

const click = async (definition) => {
    const player = playersManager.findYou();
    const bankController = player.bankController;
        
    if (bankController.canAfford(definition.costs)) {
        
        const construction = await player.spawnConstruction(definition.name);
        inspectManager.setSelected(construction);
        panelManager.clearPanel();
    } else {
        toastManager.add('toasts.shop.cannot_afford', 4000, 'danger');
    }
}
</script>