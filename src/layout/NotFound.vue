<script setup>
import WebGl from 'frontend-webgl';
import UI from 'frontend-ui';
import Locale from '../components/Locale.vue';
import { setMeta } from '../composables/meta.js';

setMeta("not_found")
</script>

<template>
  <WebGl.components.MatrixBgg class="fixed inset-0 w-full h-full" />

  <UI.Fixed>
    <UI.Flex class="h-screen text-white">

      <UI.Title>
        <Locale id="not_found.title" />
      </UI.Title>

      <UI.Paragraph>
        <Locale id="not_found.paragraph" />
      </UI.Paragraph>

      <UI.Button link="/" type="primary" class="uppercase font-bold">
        <Locale id="not_found.link" />
      </UI.Button>

    </UI.Flex>
  </UI.Fixed>
</template>
