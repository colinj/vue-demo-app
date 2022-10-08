<script setup lang="ts">
import type { IconName } from "@/types";
import { reactive, ref } from "vue";
import CcField from "./CcField.vue";
import CcInput from "./CcInput.vue";

const state = reactive({
  error: false,
  icon: "" as IconName,
});

const message = ref("");
const fieldState = reactive({
  label: "",
  hint: "",
  error: "",
  required: false,
});
</script>

<template>
  <Story title="CcInput" :layout="{ type: 'grid', width: '500px' }">
    <Variant title="default">
      <CcInput v-model="message" :icon="state.icon" :has-error="state.error" />
    </Variant>
    <Variant title="Input with Field">
      <CcField
        :label="fieldState.label"
        :hint="fieldState.hint"
        :error="fieldState.error"
        :required="fieldState.required"
      >
        <CcInput v-model="message" :icon="state.icon" />
      </CcField>
    </Variant>

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
