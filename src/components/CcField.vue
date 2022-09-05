<script setup lang="ts">
import { computed, inject, provide, ref } from "vue";
import { FieldKey, InvalidFormKey } from "@/utils/provider-keys";
import { uniqueId } from "@/utils/unique-id";

interface Props {
  id?: string;
  label?: string;
  hint?: string;
  error?: string | string[];
  required?: boolean;
  readonly?: boolean;
  shake?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  required: false,
  readonly: false,
  shake: false,
});
const invalidForm = inject(InvalidFormKey, ref(false));
const isShaking = computed(() => props.shake || invalidForm.value);
const label = computed(() => `${props.label}${props.required && !props.readonly ? " *" : ""}`);
const fieldId = computed(() => props.id ?? uniqueId("field"));
const errors = computed(() => (!props.error ? [] : typeof props.error === "string" ? [props.error] : props.error));
const hasError = computed(() => errors.value.length > 0);
const readonly = computed(() => props.readonly);
provide(FieldKey, { fieldId, hasError, readonly });
</script>

<template>
  <div class="cc-field" :class="{ 'cc-field--error': errors.length }">
    <label :for="fieldId">
      <span v-if="props.label" class="cc-field__label">{{ label }}</span>
      <small v-if="props.hint && !props.readonly" class="cc-field__hint">{{ props.hint }}</small>
    </label>
    <slot />
    <small v-for="errorMsg in errors" :key="errorMsg" class="cc-field__message" :class="{ shake: isShaking }">
      {{ errorMsg }}
    </small>
  </div>
</template>
