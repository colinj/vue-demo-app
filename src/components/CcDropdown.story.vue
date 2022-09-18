<script setup lang="ts">
import type { MenuOption } from "@/types";
import { reactive, ref } from "vue";
import CcDropdown from "./CcDropdown.vue";

const state = reactive({
  disabled: false,
});

const names = ref(["Tom", "Jane", "Peter", "Mary", "Jordan", "Polly", "Amanda", "Billy"]);
const people = ref<MenuOption[]>([
  { id: 1, title: "Tom" },
  { id: 2, title: "Jane" },
  { id: 3, title: "Peter" },
  { id: 4, title: "Jordan" },
  { id: 5, title: "Mary" },
  { id: 6, title: "Polly" },
  { id: 7, title: "Amanda" },
  { id: 8, title: "Billy" },
]);
const name = ref<string>();
const nameId = ref<number>();
</script>

<template>
  <Story title="CcDropdown">
    <Variant title="No options (empty list)">
      <div class="playground">
        <CcDropdown v-model="nameId" :options="[]">
          <button>Hello</button>
        </CcDropdown>
      </div>
    </Variant>

    <Variant title="Single-Select - Options string array">
      <div class="playground">
        <CcDropdown v-model="name" :options="names" :disabled="state.disabled">
          <button>Hello Hello Hello Hello</button>
        </CcDropdown>
      </div>
      <div>{{ name }}</div>
    </Variant>

    <Variant title="Multi-Select - Options string array">
      <div class="playground">
        <CcDropdown v-model="nameId" :options="people" :disabled="state.disabled">
          <button>Hello</button>
        </CcDropdown>
      </div>

      <div>{{ nameId }}</div>
    </Variant>

    <template #controls>
      <HstCheckbox v-model="state.disabled" title="Disabled" />
    </template>
  </Story>
</template>

<style lang="scss" scoped>
.playground {
  height: 800px;
  padding-top: 350px;
  padding-left: 100px;
}
</style>
