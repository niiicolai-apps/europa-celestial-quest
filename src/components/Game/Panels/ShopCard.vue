<template>
    <div @click="click(definition)" class="w-full box-shadow-lg relative">

        <div v-if="!isRequiredLevel(definition)" class="absolute left-0 top-0 bottom-0 right-0 p-3 shop-card-required-level">
            <UI.Flex>
                <Icons.fa.LockIcon :width="lockIconSize" :height="lockIconSize" :fill="lockIconFill" />

                <p class="text-xs font-bold uppercase text-info ml-2">
                    <Locale id="shop.require_level" /> {{ definition.requiredLevel }}
                </p>
            </UI.Flex>
        </div>

        <UI.Flex justify="between" gap="2"
            class="w-full h-full text-xs p-3 bg-info text-primary border-1 border-solid border-primary rounded bg-info-hover cursor-pointer">
            <div class="w-full">
                <UI.Flex direction="horizontal" justify="between" items="center" gap="3" class="w-full text-xs mb-2 shop-card-top">
                    <div>
                        <p class="font-bold uppercase">
                            <Locale :id="`constructions.${definition.name}.title`" />
                        </p>

                    </div>

                    <div>
                        <UI.Flex class="bg-primary w-10 h-10 rounded">
                            <img :src="definition.image" :alt="definition.name" class="block rounded w-7 rounded mx-auto" />
                        </UI.Flex>
                    </div>
                </UI.Flex>

                <p class="font-bold shop-card-description">
                    <Locale :id="`constructions.${definition.name}.description`" />
                </p>
            </div>

            

            <UI.Flex direction="horizontal" class="w-full h-13 text-info bg-primary rounded">
                <UI.Flex v-for="cost in definition.costs" :key="cost.currency" gap="1" class="text-xs w-4">
                    <div class="mt-1">
                        <Icons.fa.RingIcon v-if="cost.currency == 'metal'" :width="iconSize" :height="iconSize"
                            :fill="iconFill" />
                        <Icons.fa.IciclesIcon v-if="cost.currency == 'ice'" :width="iconSize" :height="iconSize"
                            :fill="iconFill" />
                        <Icons.fa.AtomIcon v-if="cost.currency == 'hydrogen'" :width="iconSize" :height="iconSize"
                            :fill="iconFill" />
                        <Icons.fa.HillRockSlideIcon v-if="cost.currency == 'rock'" :width="iconSize" :height="iconSize"
                            :fill="iconFill" />
                    </div>
                    <div class="text-center font-bold mb-1" style="font-size: .7em;">
                        <p class="mb-1">
                            <Locale :id="`bank.${cost.currency}`" />
                        </p>
                        <p>{{ cost.amount }}</p>
                    </div>
                </UI.Flex>
            </UI.Flex>
        </UI.Flex>
    </div>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../../General/Locale.vue';

const iconSize = "0.8em";
const iconFill = "#3f88c5";

const lockIconSize = "3em";
const lockIconFill = "#3f88c5";

defineProps({
    definition: {
        type: Object,
        required: true,
    },
    isRequiredLevel: {
        type: Function,
        required: true,
    },
    click: {
        type: Function,
        required: true,
    },
});
</script>

<style scoped>
.shop-card-top {
    height: auto;
}

.shop-card-required-level {
    background-color: rgba(0, 0, 0, 0.842);
}

.shop-card-description {
    font-size: .9em;
}
</style>