<script setup lang="ts">
import { reactive, ref } from "vue";
import CcSelect from "./CcSelect.vue";

const names = ref(["Tom", "Jane", "Peter", "Mary", "Jordan", "Polly", "Amanda", "Billy"]);
const name1 = ref<string>();
// const name2 = ref<string[]>([]);
const state = reactive({
  disabled: false,
  multiple: false,
  allowEmpty: false,
});
</script>

<template>
  <Story title="CcSelect">
    <Variant title="Options array">
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

    <!-- <Variant title="Options object">
      <CcSelect
        v-model="name2"
        :options="{ tom: 'Tom Smith', pete: 'Peter Jones', mary: 'Mary Thompson' }"
        :disabled="disabled"
        class="grid"
      />

      <div>{{ name2 }}</div>
    </Variant> -->

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
