<script setup lang="ts">
import { reactive, ref } from "vue";
import CcSelect from "./CcSelect.vue";

interface Person {
  name: string;
  age: number;
  pet?: string;
}

type ItemType = {
  name: string;
  height: number;
  size: string;
  id: number;
};

const state = reactive({
  placeholder: "Please select an option",
  disabled: false,
  required: false,
  searchable: false,
  showTags: false,
});

const names = ref(["Tom", "Jane", "Peter", "Mary", "Jordan", "Polly", "Amanda", "Billy"]);
const people = ref<Person[]>([
  { name: "Tom", age: 23, pet: "Paddington" },
  { name: "Jane", age: 42, pet: "Fido" },
  { name: "Peter", age: 51 },
  { name: "Mary", age: 26, pet: "Doggo" },
  { name: "Jordan", age: 37 },
  { name: "Polly", age: 15, pet: "Missy" },
  { name: "Amanda", age: 29 },
  { name: "Billy", age: 31, pet: "Rango" },
]);
const name = ref<string>();
const nameStringArray = ref<string[]>([]);

const person = ref<Person>();
const personArray = ref<Person[]>([]);

const item = ref<ItemType>();
const items = ref<ItemType[]>([]);
const manyItems = ref<ItemType[]>(
  Array.from(Array(30).keys()).map((i) => ({
    name: `Item ${i}`,
    height: i % 2 === 0 ? 42 : 84,
    size: i % 2 === 0 ? "small" : "large",
    id: i,
  }))
);
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
          :required="state.required"
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
          :required="state.required"
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
          :required="state.required"
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
          v-model="person"
          :options="people"
          option-key="name"
          label="name"
          :searchable="state.searchable"
          :required="state.required"
          :disabled="state.disabled"
          :placeholder="state.placeholder"
        />
      </div>
      <div>{{ name }}</div>
      <div v-if="name === undefined">Undefined value!</div>
    </Variant>

    <Variant title="Options object array - Multi Select">
      <div class="playground">
        <CcSelect
          v-model="person"
          :options="people"
          option-key="name"
          label="name"
          :searchable="state.searchable"
          :required="state.required"
          :disabled="state.disabled"
        />
      </div>
      <div>{{ personArray }}</div>
    </Variant>

    <Variant title="Options object array with label function (single select)">
      <div class="playground">
        <CcSelect
          v-model="person"
          :options="people"
          option-key="name"
          :label="(val) => `${val.name} is awesome!`"
          :searchable="state.searchable"
          :required="state.required"
          :disabled="state.disabled"
          :placeholder="state.placeholder"
        />
      </div>
      <div>{{ name }}</div>
    </Variant>

    <Variant title="Single select: Large options object array">
      <div class="playground">
        <CcSelect
          v-model="item"
          :options="manyItems"
          label="name"
          option-key="id"
          :searchable="state.searchable"
          :required="state.required"
          :disabled="state.disabled"
          :placeholder="state.placeholder"
        />
      </div>
      <div>{{ name }}</div>
    </Variant>

    <Variant title="Multi-select: Large options object array">
      <div class="playground">
        <CcSelect
          v-model="items"
          :options="manyItems"
          label="name"
          option-key="id"
          :searchable="state.searchable"
          :required="state.required"
          :disabled="state.disabled"
          :placeholder="state.placeholder"
        />
      </div>
      <div>{{ name }}</div>
    </Variant>

    <template #controls>
      <HstText v-model="state.placeholder" title="Placeholder" />
      <HstCheckbox v-model="state.required" title="Required" />
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
