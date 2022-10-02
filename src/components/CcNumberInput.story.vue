<script setup lang="ts">
import type { IconName } from "@/types";
import { reactive, ref } from "vue";
// import CcField from "./CcField.vue";
import CcNumberInput from "./CcNumberInput.vue";

const state = reactive({
  error: false,
  icon: "" as IconName,
});

const numVal = ref(0);
const fieldState = reactive({
  label: "",
  hint: "",
  error: "",
  required: false,
});
</script>

<template>
  <Story title="CcNumberInput" :layout="{ type: 'grid', width: '100%' }">
    <Variant title="default">
      <div class="playground">
        <CcNumberInput v-model="numVal" :icon="state.icon" :has-error="state.error" placeholder="0.00" />
        <div>{{ numVal }}</div>
      </div>
    </Variant>
    <!-- <Variant title="Input with Field">
      <div class="playground">
        <CcField
          :label="fieldState.label"
          :hint="fieldState.hint"
          :error="fieldState.error"
          :required="fieldState.required"
        >
          <CcNumberInput v-model="numVal" :icon="state.icon" />
        </CcField>
      </div>
    </Variant> -->

    <template #controls>
      <HstText v-model="state.icon" title="Icon" />
      <HstCheckbox v-model="state.error" title="Has error" />
      <HstText v-model="fieldState.label" title="Field label" />
      <HstText v-model="fieldState.hint" title="Field hint" />
      <HstText v-model="fieldState.error" title="Error message" />
      <HstCheckbox v-model="fieldState.required" title="Required" />
    </template>
  </Story>
</template>

<style lang="scss" scoped>
.playground {
  width: 200px;
}
</style>
