<script setup lang="ts">
import { reactive, ref } from "vue";
import { hstEvent } from "histoire/client";
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
  maxHeight: 200,
});

const p = ref<Person>();
const updateValue = () => {
  p.value = person.value;
};
</script>

<template>
  <Story title="CcList">
    <Variant title="No items (empty list)">
      <div class="playground">
        <CcList v-model="name" :items="([] as string[])" />
      </div>
    </Variant>

    <Variant title="no-items slot: No items (empty list)">
      <div class="playground">
        <CcList v-model="name" :items="([] as string[])">
          <template #emptyList><em>Hey! You have no items available!</em></template>
        </CcList>
      </div>
    </Variant>

    <Variant title="Single-Select: String array items">
      <div class="playground">
        <CcList
          v-model="name"
          :items="names"
          :max-height="state.maxHeight"
          :required="state.required"
          :disabled="state.disabled"
          v-slot="{ item }"
          @select="hstEvent('Select', { value: $event })"
        >
          {{ item + " Yes. this is a string" }}
        </CcList>
      </div>
      <div>{{ name ?? "Undefined value" }}</div>
    </Variant>

    <Variant title="Single Select: Object array items">
      <div class="playground">
        <CcList
          v-model="person"
          :items="people"
          :required="state.required"
          :disabled="state.disabled"
          item-key="age"
          v-slot="{ item }"
          @select="updateValue()"
        >
          {{ item.name }} from the object
        </CcList>
      </div>
      <div>{{ person ?? "Undefined value!" }}</div>
      <div>P = {{ p ?? "Undefined value!" }}</div>
    </Variant>

    <Variant title="Multi-Select: String array items">
      <div class="playground">
        <CcList v-model="nameStringArray" :items="names" :required="state.required" :disabled="state.disabled" />
      </div>
      <div>{{ nameStringArray }}</div>
    </Variant>

    <Variant title="Multi-Select: Object array items">
      <div class="playground">
        <CcList
          v-model="personArray"
          :items="people"
          :required="state.required"
          :disabled="state.disabled"
          item-key="name"
        >
          <template #default="{ item }">{{ item.name }} from the object</template>
        </CcList>
      </div>
      <div>{{ personArray }}</div>
    </Variant>

    <Variant title="Disable items">
      <div class="playground">
        <CcList
          v-model="name"
          :items="names"
          :required="state.required"
          :disabled="state.disabled"
          :disable-item="(index) => index % 3 === 0"
          v-slot="{ item }"
        >
          {{ item + " Yes. this is a string" }}
        </CcList>
      </div>
      <div>{{ name ?? "Undefined value" }}</div>
    </Variant>

    <Variant title="Select event: String array items">
      <div class="playground">
        <CcList
          :items="names"
          :required="state.required"
          :disabled="state.disabled"
          @select="hstEvent('Select', { value: $event })"
        ></CcList>
      </div>
    </Variant>

    <Variant title="Select event: Object array items">
      <div class="playground">
        <CcList
          :items="people"
          item-key="name"
          :required="state.required"
          :disabled="state.disabled"
          @select="hstEvent('Select', $event)"
          v-slot="{ item }"
        >
          {{ item.name }} has {{ item.pet ? `a pet named ${item.pet}` : "no pet" }}
        </CcList>
      </div>
    </Variant>

    <Variant title="Single Select: Object array items">
      <div class="playground">
        <CcList
          v-model="item"
          :items="manyItems"
          :max-height="state.maxHeight"
          :required="state.required"
          :disabled="state.disabled"
          item-key="id"
          v-slot="{ item: thing }"
        >
          {{ thing.name }} from the object
        </CcList>
      </div>
      <div>{{ item ?? "Undefined value!" }}</div>
    </Variant>

    <template #controls>
      <HstNumber v-model="state.maxHeight" title="Max Height" />
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
