<template>
    <UI.Panel transition_name="slide-up" :show="selectedPanel === 'release_notes'">
        <div class="bg-white rounded w-full h-screen">
            <div class="p-5 bg-primary flex items-center justify-start gap-3">
                <UI.Button type="danger" class="flex items-center justify-center" @click="setPanel('')">
                    <Icons.fa.TimesIcon width="1em" height="1em" fill="white" />
                </UI.Button>
                <UI.SubTitle class="uppercase text-white">
                    Release Notes
                </UI.SubTitle>
            </div>
            
            <div class="p-5">
                <UI.Paragraph class="mb-5">Body</UI.Paragraph>
            </div>
        </div>
    </UI.Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
defineProps({
    selectedPanel: {
        type: String,
        required: true,
    },
    setPanel: {
        type: Function,
        required: true,
    },
})
</script>