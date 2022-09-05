<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed, inject } from "vue";
import type { IconKind } from "@/types";
import { FieldKey } from "@/utils/provider-keys";
import CcIcon from "@/components/CcIcon.vue";

interface Props {
  id?: string;
  modelValue?: string | number;
  type?: string;
  modelModifiers?: { lazy: boolean };
  icon?: IconKind;
  isLoading?: boolean;
  hasError?: boolean;
  readonly?: boolean;
  class?: string;
  componentClass?: string;
}
const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  modelValue: undefined,
  modelModifiers: () => ({ lazy: false }),
  type: "text",
  icon: undefined,
  readonly: false,
  isLoading: false,
  hasError: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", v: string | number): void;
}>();

const updateValue = (target: HTMLInputElement) => {
  const value = props.type === "number" ? Number(target.value) : target.value;
  emit("update:modelValue", value);
};
const { fieldId, hasError, readonly } = inject(FieldKey, {});
const id = computed(() => props.id || fieldId?.value);
const isTextArea = computed(() => props.type === "textarea");
const inputComponent = computed(() => (isTextArea.value ? "textarea" : "input"));
const inputType = computed(() => (isTextArea.value ? null : props.type));
const eventType = computed(() => (props.modelModifiers.lazy ? "change" : "input"));
</script>

<template>
  <div class="cc-input" :class="[props.class, { 'cc-input--textarea': props.type === 'textarea' }]">
    <CcIcon v-if="icon && !isTextArea" class="cc-input__icon" :name="icon" />
    <component
      :is="inputComponent"
      :id="id"
      :name="id"
      :autocomplete="id"
      class="cc-input__control"
      :class="[{ 'cc-input--error': hasError || props.hasError }, componentClass]"
      :type="inputType"
      :value="props.modelValue"
      :readonly="props.readonly || readonly"
      v-bind="$attrs"
      @[eventType]="updateValue($event.target as HTMLInputElement)"
    />
  </div>
</template>
