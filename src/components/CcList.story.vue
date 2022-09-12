<script setup lang="ts">
import { reactive, ref } from "vue";
import CcList from "./CcList.vue";

interface Person {
  name: string;
  age: number;
  pet?: string;
}

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
const person = ref<Person>({} as Person);
const personArray = ref<Person[]>([]);

const state = reactive({
  allowEmpty: false,
  disabled: false,
});
</script>

<template>
  <Story title="CcList">
    <Variant title="No options (empty list)">
      <div class="playground">
        <CcList v-model="name" :options="([] as string[])" />
      </div>
    </Variant>

    <Variant title="no-options slot: No options (empty list)">
      <div class="playground">
        <CcList v-model="name" :options="([] as string[])">
          <template #noOptions><em>Hey! You have no options available!</em></template>
        </CcList>
      </div>
    </Variant>

    <Variant title="Single-Select: String array options">
      <div class="playground">
        <CcList
          v-model="name"
          :options="names"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
          v-slot="{ option }"
        >
          {{ option + " Yes. this is a string" }}
        </CcList>
      </div>
      <div>{{ name ?? "Undefined value" }}</div>
    </Variant>

    <Variant title="Single Select: Object array options">
      <div class="playground">
        <CcList
          v-model="person"
          :options="people"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
          key="age"
          v-slot="{ option }"
        >
          {{ option.name }} from the object
        </CcList>
      </div>
      <div>{{ person ?? "Undefined value!" }}</div>
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
          v-model="personArray"
          :options="people"
          :allow-empty="state.allowEmpty"
          :disabled="state.disabled"
          key="name"
        >
          <template #default="{ option }">{{ option.name }} from the object</template>
        </CcList>
      </div>
      <div>{{ personArray }}</div>
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
