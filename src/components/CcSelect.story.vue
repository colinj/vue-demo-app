<script setup lang="ts">
import { ref } from "vue";
import CcSelect from "./CcSelect.vue";

const name1 = ref<string[]>([]);
// const name2 = ref<string[]>([]);
const disabled = ref(false);
</script>

<template>
  <Story title="CcSelect" :layout="{ type: 'grid', width: '100%' }">
    <Variant title="Options array">
      <div class="playground">
        <CcSelect v-model="name1" :options="['Tom', 'Peter', 'Mary']" :disabled="disabled" />
      </div>
      <div>{{ name1 }}</div>
    </Variant>

    <!-- <Variant title="Options object">
      <CcSelect
        v-model="name2"
        :options="{ tom: 'Tom Smith', pete: 'Peter Jones', mary: 'Mary Thompson' }"
        :disabled="disabled"
        class="grid"
      />

      <div>{{ name2 }}</div>
    </Variant> -->

    <template #controls>
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>
  </Story>
</template>

<style lang="scss" scoped>
.playground {
  height: 400px;
}
</style>
