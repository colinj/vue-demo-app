<script lang="ts">
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import SimpleLayout from "@/layouts/SimpleLayout.vue";

export default {
  components: {
    DefaultLayout,
    SimpleLayout,
  },
};
</script>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const layout = ref<string>();
const route = useRoute();

watch(
  () => route.meta,
  (meta) => {
    layout.value = meta.layout ?? "DefaultLayout";
  }
);
</script>

<template>
  <Component :is="layout" />
</template>
