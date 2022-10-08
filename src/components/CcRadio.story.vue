<script setup lang="ts">
import { ref } from "vue";
import CcRadio from "./CcRadio.vue";

const name1 = ref("");
const name2 = ref("");
const disabled = ref(false);
const outline = ref(false);
</script>

<template>
  <Story title="CcRadio" :layout="{ type: 'grid', width: '300px' }">
    <Variant title="Options array">
      <CcRadio
        v-model="name1"
        :options="['Tom', 'Peter', 'Mary']"
        :outline="outline"
        :disabled="disabled"
        class="grid"
      />

      <div>{{ name1 }}</div>
    </Variant>
    <Variant title="Options object">
      <CcRadio
        v-model="name2"
        :options="{ tom: 'Tom Smith', pete: 'Peter Jones', mary: 'Mary Thompson' }"
        :outline="outline"
        :disabled="disabled"
        class="grid"
      />

      <div>{{ name2 }}</div>
    </Variant>
    <template #controls>
      <HstCheckbox v-model="outline" title="Outline" />
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>
  </Story>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  gap: 8px;
}
</style>
