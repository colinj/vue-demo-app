<script setup lang="ts">
import { reactive, ref } from "vue";
import { hstEvent } from "histoire/client";
import CcList from "./CcList.vue";

interface Person {
  name: string;
  age: number;
  pet?: string;
}
const names = ["Tom", "Jane", "Peter", "Mary", "Jordan", "Polly", "Amanda", "Billy"];
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

type ItemType = {
  name: string;
  height: number;
  size: string;
  id: number;
};

const manyItems = ref<ItemType[]>(
  Array.from(Array(30).keys()).map((i) => ({
    name: `Item ${i}`,
    height: i % 2 === 0 ? 42 : 84,
    size: i % 2 === 0 ? "small" : "large",
    id: i,
  }))
);

const item = ref<ItemType>(manyItems.value[0]);

const name = ref<string>();
const nameStringArray = ref<string[]>([]);
const person = ref<Person>({} as Person);
const personArray = ref<Person[]>([]);

const state = reactive({
  required: false,
  disabled: false,
  maxHeight: "200px",
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
          :max-height="state.maxHeight"
          :required="state.required"
          :disabled="state.disabled"
          v-slot="{ option }"
          @select="hstEvent('Select', { value: $event })"
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
          :required="state.required"
          :disabled="state.disabled"
          option-key="age"
          v-slot="{ option }"
        >
          {{ option.name }} from the object
        </CcList>
      </div>
      <div>{{ person ?? "Undefined value!" }}</div>
    </Variant>

    <Variant title="Multi-Select: String array options">
      <div class="playground">
        <CcList v-model="nameStringArray" :options="names" :required="state.required" :disabled="state.disabled" />
      </div>
      <div>{{ nameStringArray }}</div>
    </Variant>

    <Variant title="Multi-Select: Object array options">
      <div class="playground">
        <CcList
          v-model="personArray"
          :options="people"
          :required="state.required"
          :disabled="state.disabled"
          option-key="name"
        >
          <template #default="{ option }">{{ option.name }} from the object</template>
        </CcList>
      </div>
      <div>{{ personArray }}</div>
    </Variant>

    <Variant title="Disable items">
      <div class="playground">
        <CcList
          v-model="name"
          :options="names"
          :required="state.required"
          :disabled="state.disabled"
          :disable-item="(index) => index % 3 === 0"
          v-slot="{ option }"
        >
          {{ option + " Yes. this is a string" }}
        </CcList>
      </div>
      <div>{{ name ?? "Undefined value" }}</div>
    </Variant>

    <Variant title="Select event: String array options">
      <div class="playground">
        <CcList
          :options="names"
          :required="state.required"
          :disabled="state.disabled"
          @select="hstEvent('Select', { value: $event })"
        ></CcList>
      </div>
    </Variant>

    <Variant title="Select event: Object array options">
      <div class="playground">
        <CcList
          :options="people"
          option-key="name"
          :required="state.required"
          :disabled="state.disabled"
          @select="hstEvent('Select', $event)"
          v-slot="{ option }"
        >
          {{ option.name }} has {{ option.pet ? `a pet named ${option.pet}` : "no pet" }}
        </CcList>
      </div>
    </Variant>

    <Variant title="Single Select: Object array options">
      <div class="playground">
        <CcList
          v-model="item"
          :options="manyItems"
          :max-height="state.maxHeight"
          :required="state.required"
          :disabled="state.disabled"
          option-key="id"
          v-slot="{ option }"
        >
          {{ option.name }} from the object
        </CcList>
      </div>
      <div>{{ item ?? "Undefined value!" }}</div>
    </Variant>

    <template #controls>
      <HstText v-model="state.maxHeight" title="Max Height" />
      <HstCheckbox v-model="state.required" title="Required" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
    </template>
  </Story>
</template>

<style lang="scss" scoped>
.playground {
  height: 400px;
}
</style>
