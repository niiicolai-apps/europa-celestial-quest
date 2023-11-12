<template>
    <a
        v-if="external"
        :href="to"
        :target="target"
        class="text-lg text-blue-500 hover:underline"
    >
        <slot></slot>
    </a>

    <router-link
        v-else
        :to="to"
        :target="target"
        class="text-lg text-blue-500 hover:underline"
    >
        <slot></slot>
    </router-link>
</template>

<script setup>
defineProps({
    to: {
        type: String,
        required: true,
    },
    target: {
        type: String,
        required: false,
        default: '_self',
    },
    external: {
        type: Boolean,
        default: false,
    },
});
</script>