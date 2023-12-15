<template>
<UI.Fixed v-if="!isComplete" style="z-index: 1000">
    <div class="bg-black opacity-50 w-full h-full absolute text-white p-5">
        <UI.Flex>
            <UI.Title>
                {{ title }}
            </UI.Title>

            <UI.Paragraph>
                {{ description }}
            </UI.Paragraph>
            
            <UI.ProgressBar
                :progress="progress"
                :maxProgress="maxProgress"
                :showProgress="true"
            />
        </UI.Flex>
    </div>
</UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui'
import { computed } from 'vue'
import { useDebugLoader } from '../../composables/debug_loader.js'

const debugLoader = useDebugLoader()
const isComplete = computed(() => debugLoader.isComplete())
const title = computed(() => debugLoader.title.value)
const description = computed(() => debugLoader.description.value)
const progress = computed(() => debugLoader.progress.value)
const maxProgress = computed(() => debugLoader.maxProgress.value)
</script>