<script setup lang="ts">
import { ref } from "vue";
import CcCheckbox from "./CcCheckbox.vue";

const name1 = ref<string[]>([]);
const name2 = ref<string[]>([]);
const name3 = ref<string[]>([]);
const counters = ref<number[]>([]);
const toggle = ref(false);
const person = ref("");
const counter = ref(0);
const disabled = ref(false);
const indeterminate = ref(false);
</script>

<template>
  <Story title="CcCheckbox" :layout="{ type: 'grid', width: '100%' }">
    <Variant title="Options string array">
      <CcCheckbox
        v-model="name1"
        :options="['Tom', 'Peter', 'Mary']"
        :disabled="disabled"
        :indeterminate="indeterminate"
        class="grid"
      />
      <div>{{ name1 }}</div>
    </Variant>

    <Variant title="Options number array">
      <CcCheckbox
        v-model="counters"
        :options="[23, 15, 99, 47, 62, 91]"
        :disabled="disabled"
        :indeterminate="indeterminate"
        class="grid"
      />
      <div>{{ counters }}</div>
    </Variant>

    <Variant title="Options object">
      <CcCheckbox
        v-model="name2"
        :options="{ tom: 'Tom Smith', pete: 'Peter Jones', mary: 'Mary Thompson' }"
        :disabled="disabled"
        class="grid"
      />
      <div>{{ name2 }}</div>
    </Variant>

    <Variant title="Multiple checkboxes">
      <CcCheckbox v-model="name3" value="John" :disabled="disabled" class="grid" />
      <CcCheckbox v-model="name3" value="Peter" :disabled="disabled" class="grid" />
      <div>{{ name3 }}</div>
    </Variant>

    <Variant title="Boolean checkbox">
      <CcCheckbox v-model="toggle" :value="true" :disabled="disabled" class="grid">Feature X</CcCheckbox>
      <div>{{ toggle }}</div>
    </Variant>

    <Variant title="String value checkbox">
      <CcCheckbox v-model="person" value="Peter" :disabled="disabled" class="grid">This is Peter</CcCheckbox>
      <div>{{ person }}</div>
    </Variant>

    <Variant title="Number value checkbox">
      <CcCheckbox v-model="counter" :value="123" :disabled="disabled" class="grid">This is valued at 123</CcCheckbox>
      <div>{{ counter }}</div>
    </Variant>

    <template #controls>
      <HstCheckbox v-model="disabled" title="Disabled" />
      <HstCheckbox v-model="indeterminate" title="Indeterminate" />
    </template>
  </Story>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  gap: 8px;
}
</style>
