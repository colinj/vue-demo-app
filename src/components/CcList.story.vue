<script setup lang="ts">
import { reactive, ref } from "vue";
import CcList from "./CcList.vue";

interface People {
  name: string;
  age: number;
  pet?: string;
}

const names = ref(["Tom", "Jane", "Peter", "Mary", "Jordan", "Polly", "Amanda", "Billy"]);
const people = ref([
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
const nameObjectArray = ref<People[]>([]);
const state = reactive({
  allowEmpty: false,
  disabled: false,
});
</script>

<template>
  <Story title="CcList">
    <Variant title="No options (empty list)">
      <div class="playground">
        <CcList v-model="name" :options="[]" placeholder="Please choose an option" />
      </div>
    </Variant>

    <Variant title="no-options slot: No options (empty list)">
      <div class="playground">
        <CcList v-model="name" :options="[]" placeholder="Please select an option">
          <template #noOptions><em>Hey! You have no options available!</em></template>
        </CcList>
      </div>
    </Variant>

    <Variant title="Single-Select: String array options">
      <div class="playground">
        <CcList v-model="name" :options="names" :allow-empty="state.allowEmpty" :disabled="state.disabled" />
      </div>
      <div>{{ name }}</div>
    </Variant>

    <Variant title="Single Select: Object array options">
      <div class="playground">
        <CcList
          v-model="name"
          :options="people"
          label="name"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
        />
      </div>
      <div>{{ name }}</div>
      <div v-if="name === undefined">Undefined value!</div>
    </Variant>

    <Variant title="Multi-Select: String array options">
      <div class="playground">
        <CcList v-model="nameStringArray" :options="names" :allow-empty="state.allowEmpty" :disabled="state.disabled" />
      </div>
      <div>{{ nameStringArray }}</div>
    </Variant>

    <Variant title="Multi-Select: Object array options">
      <div class="playground">
        <CcList
          v-model="nameObjectArray"
          :options="people"
          option-key="name"
          label="name"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
        />
      </div>
      <div>{{ nameObjectArray }}</div>
    </Variant>

    <Variant title="Options object array with label function (single select)">
      <div class="playground">
        <CcList
          v-model="name"
          :options="people"
          :label="(val) => `${val.name} is awesome!`"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
        />
      </div>
      <div>{{ name }}</div>
    </Variant>

    <template #controls>
      <HstCheckbox v-model="state.allowEmpty" title="Allow empty" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
    </template>
  </Story>
</template>

<style lang="scss" scoped>
.playground {
  height: 400px;
}
</style>
