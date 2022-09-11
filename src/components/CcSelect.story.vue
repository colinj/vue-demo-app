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
const name = ref<string>();
const nameStringArray = ref<string[]>([]);
const nameObjectArray = ref<People[]>([]);
const state = reactive({
  placeholder: "Please select an option",
  disabled: false,
  allowEmpty: false,
  searchable: false,
  showTags: false,
});
</script>

<template>
  <Story title="CcSelect">
    <Variant title="No options (empty list)">
      <div class="playground">
        <CcSelect v-model="name" :options="[]" placeholder="Please choose an option" />
      </div>
    </Variant>

    <Variant title="no-options slot: No options (empty list)">
      <div class="playground">
        <CcSelect v-model="name" :options="[]" placeholder="Please select an option">
          <template #noOptions><em>Hey! You have no options available!</em></template>
        </CcSelect>
      </div>
    </Variant>

    <Variant title="Single-Select - Options string array">
      <div class="playground">
        <CcSelect
          v-model="name"
          :options="names"
          :allow-empty="state.allowEmpty"
          :searchable="state.searchable"
          :show-tags="state.showTags"
          :disabled="state.disabled"
          :placeholder="state.placeholder"
        />
      </div>
      <div>{{ name }}</div>
    </Variant>

    <Variant title="Multi-Select - Options string array">
      <div class="playground">
        <CcSelect
          v-model="nameStringArray"
          :options="names"
          :allow-empty="state.allowEmpty"
          :searchable="state.searchable"
          :show-tags="state.showTags"
          :disabled="state.disabled"
          :placeholder="state.placeholder"
        />
      </div>
      <div>{{ nameStringArray }}</div>
    </Variant>

    <Variant title="Multi-Select (Show tags) - Options string array">
      <div class="playground">
        <CcSelect
          v-model="nameStringArray"
          :options="names"
          show-tags
          :allow-empty="state.allowEmpty"
          :searchable="state.searchable"
          :disabled="state.disabled"
          :placeholder="state.placeholder"
        />
      </div>
      <div>{{ nameStringArray }}</div>
    </Variant>

    <Variant title="Options object array - Single Select">
      <div class="playground">
        <CcSelect
          v-model="name"
          :options="people"
          label="name"
          :searchable="state.searchable"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
          :placeholder="state.placeholder"
        />
      </div>
      <div>{{ name }}</div>
    </Variant>

    <Variant title="Options object array - Multi Select">
      <div class="playground">
        <CcSelect
          v-model="nameObjectArray"
          :options="people"
          option-key="name"
          label="name"
          :searchable="state.searchable"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
        />
      </div>
      <div>{{ nameObjectArray }}</div>
    </Variant>

    <Variant title="Options object array with label function (single select)">
      <div class="playground">
        <CcSelect
          v-model="name"
          :options="people"
          :label="(val) => `${val.name} is awesome!`"
          :searchable="state.searchable"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
          :placeholder="state.placeholder"
        />
      </div>
      <div>{{ name }}</div>
    </Variant>

    <template #controls>
      <HstText v-model="state.placeholder" title="Placeholder" />
      <HstCheckbox v-model="state.allowEmpty" title="Allow empty" />
      <HstCheckbox v-model="state.searchable" title="Searchable" />
      <HstCheckbox v-model="state.showTags" title="Show tags" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
    </template>
  </Story>
</template>

<style lang="scss" scoped>
.playground {
  height: 400px;
}
</style>
