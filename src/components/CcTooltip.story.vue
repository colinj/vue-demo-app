<script setup lang="ts">
import CcTooltip from "./CcTooltip.vue";
</script>

<template>
  <Story title="CcTooltip">
    <Variant title="default">
      <CcTooltip />
    </Variant>

    <!-- <template #controls>
      <HstText v-model="state.name" title="Icon" />
      <HstSelect v-model="state.kind" :options="iconKind" title="Icon style" />
      <HstSelect v-model="colorName" :options="colorNames" title="Color" />
      <HstSelect v-model="colorShade" :options="colorShades" title="Shade" />
      <HstText v-model="state.size" title="Size" />
    </template> -->
  </Story>
</template>
