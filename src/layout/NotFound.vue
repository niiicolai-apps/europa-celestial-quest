<script setup>
import Link from '../components/UI/Link.vue';
import Locale from '../components/Locale.vue';
import { setMeta } from '../composables/meta.js';

setMeta("not_found")
</script>

<template>
  <div>
    <div>

      <h2>
        <Locale id="not_found.title" />
      </h2>

      <p>
        <Locale id="not_found.paragraph" />
      </p>

      <Link to="/" class="text-green-700">
        <Locale id="not_found.link" />
      </Link>

    </div>
  </div>
</template>
