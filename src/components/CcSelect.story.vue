<script setup lang="ts">
import { reactive, ref } from "vue";
import CcSelect from "./CcSelect.vue";

const names = ref(["Tom", "Jane", "Peter", "Mary", "Jordan", "Polly", "Amanda", "Billy"]);
const people = ref([
  { name: "Tom", age: 23 },
  { name: "Jane", age: 42 },
  { name: "Peter", age: 51 },
  { name: "Mary", age: 26 },
  { name: "Jordan", age: 37 },
]);
const name1 = ref<string>();
const name2 = ref<{ name: string; age: number }[]>([]);
const state = reactive({
  disabled: false,
  multiple: false,
  allowEmpty: false,
});
</script>

<template>
  <Story title="CcSelect">
    <Variant title="Options string array">
      <div class="playground">
        <CcSelect
          v-model="name1"
          :options="names"
          :multiple="state.multiple"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
        />
      </div>
      <div>{{ name1 }}</div>
    </Variant>

    <Variant title="Options object array">
      <div class="playground">
        <CcSelect
          v-model="name2"
          :options="people"
          label="name"
          :multiple="state.multiple"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
        />
      </div>
      <div>{{ name2 }}</div>
    </Variant>

    <template #controls>
      <HstCheckbox v-model="state.allowEmpty" title="Allow empty" />
      <HstCheckbox v-model="state.multiple" title="Multiple" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
    </template>
  </Story>
</template>

<style lang="scss" scoped>
.playground {
  height: 400px;
}
</style>
