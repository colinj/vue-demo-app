<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { uniqueId } from "@/utils/unique-id";

type CheckboxValue = string | number | boolean;
type CheckboxOptions = Array<CheckboxValue> | Record<string, CheckboxValue>;

interface Props {
  id?: string;
  modelValue: CheckboxValue[];
  options?: CheckboxOptions;
  value?: CheckboxValue;
  indeterminate?: boolean;
  disabled: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  indeterminate: false,
  disabled: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", v: CheckboxValue | CheckboxValue[] | undefined): void;
}>();

const inputValue = ref<string[]>([]);
const cbId = computed(() => props.id ?? uniqueId("checkbox"));
const checkboxOptions = computed<[string, CheckboxValue][]>(() => {
  if (props.options) {
    return Array.isArray(props.options) ? props.options.map((s) => [s.toString(), s]) : Object.entries(props.options);
  } else {
    return props.value ? [[props.value.toString(), props.value]] : [];
  }
});

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const selected = target.checked
    ? [...props.modelValue, target.value]
    : props.modelValue.filter((x) => x !== target.value);
  emit("update:modelValue", selected);
};

watch(
  () => inputValue.value,
  (val) => emit("update:modelValue", val)
);
</script>

<template>
  <div :class="{ 'cc-checkbox--disabled': props.disabled }" @change="onChange">
    <div v-for="(option, idx) in checkboxOptions" :key="option[0]" class="cc-checkbox">
      <input
        :id="`${cbId}--${idx}`"
        :checked="inputValue.includes(option[0])"
        type="checkbox"
        :value="option[0]"
        :indeterminate="props.indeterminate"
        :disabled="props.disabled"
      />
      <label :for="`${cbId}--${idx}`" class="cc-checkbox__label" tabindex="-1 ">
        <svg class="cc-checkbox__check" viewBox="0 0 12 10">
          <polyline points="1 6 5 9 11 1" />
        </svg>
        <slot>{{ option[1] }}</slot>
      </label>
    </div>
  </div>
</template>
