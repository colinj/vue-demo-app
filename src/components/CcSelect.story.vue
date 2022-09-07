<script setup lang="ts">
import { reactive, ref } from "vue";
import CcSelect from "./CcSelect.vue";

interface People {
  name: string;
  age: number;
  pet?: string;
}

const names = ref(["Tom", "Jane", "Peter", "Mary", "Jordan", "Polly", "Amanda", "Billy"]);
const people = ref([
  { name: "Tom", age: 23, pet: "Pussy Galore" },
  { name: "Jane", age: 42, pet: "Fido" },
  { name: "Peter", age: 51 },
  { name: "Mary", age: 26, pet: "Doggo" },
  { name: "Jordan", age: 37 },
]);
const name1 = ref<string>();
const name2 = ref<People[]>([]);
const state = reactive({
  disabled: false,
  allowEmpty: false,
  searchable: false,
});
</script>

<template>
  <Story title="CcSelect">
    <Variant title="Single-Select - Options string array">
      <div class="playground">
        <CcSelect
          v-model="name1"
          :options="names"
          :allow-empty="state.allowEmpty"
          :searchable="state.searchable"
          :disabled="state.disabled"
        />
      </div>
      <div>{{ name1 }}</div>
    </Variant>

    <Variant title="Multi-Select - Options string array">
      <div class="playground">
        <CcSelect
          v-model="name1"
          :options="names"
          multiple
          :allow-empty="state.allowEmpty"
          :searchable="state.searchable"
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
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
        />
      </div>
      <div>{{ name2 }}</div>
    </Variant>

    <Variant title="Options object array with label function">
      <div class="playground">
        <CcSelect
          v-model="name2"
          :options="people"
          :label="(val) => `${val.name} is awesome!`"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
        />
      </div>
      <div>{{ name2 }}</div>
    </Variant>

    <template #controls>
      <HstCheckbox v-model="state.allowEmpty" title="Allow empty" />
      <HstCheckbox v-model="state.searchable" title="Searchable" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
    </template>
  </Story>
</template>

<style lang="scss" scoped>
.playground {
  height: 400px;
}
</style>
