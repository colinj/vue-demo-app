<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from "vue";
import type { IconName } from "@/types";
import { FieldKey } from "@/utils/provider-keys";
import CcIcon from "@/components/CcIcon.vue";

interface Props {
  id?: string;
  modelValue?: number | undefined;
  modelModifiers?: { lazy: boolean };
  icon?: IconName;
  isLoading?: boolean;
  hasError?: boolean;
  readonly?: boolean;
  class?: string;
  componentClass?: string;
  thousandSeparator?: string;
  decimalPlaces?: number;
  formatter?: (val: number) => string;
}
const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  modelValue: undefined,
  modelModifiers: () => ({ lazy: false }),
  icon: undefined,
  readonly: false,
  isLoading: false,
  hasError: false,
  formatter: new Intl.NumberFormat("en-AU", { maximumFractionDigits: 2 }).format,
  decimalPlaces: 2,
});

const emit = defineEmits<{
  (e: "update:modelValue", v: number | undefined): void;
}>();
const inputRef = ref<HTMLInputElement | null>(null);

const { fieldId, hasError, readonly } = inject(FieldKey, {});
const id = computed(() => props.id || fieldId?.value);
const eventType = computed(() => (props.modelModifiers.lazy ? "change" : "input"));

const stripDelimiter = (delim: string, s: string) => s.replaceAll(delim, "");
const inputVal = ref("");
let updatePos = false;
let newPos = 0;

const updateValue = (target: HTMLInputElement) => {
  const decimalPos = target.value.indexOf(".");
  const integerVal = decimalPos < 0 ? target.value : target.value.substring(0, decimalPos);
  const decimalVal = decimalPos < 0 ? "" : target.value.substring(decimalPos, decimalPos + props.decimalPlaces + 1);
  const value = Number(stripDelimiter(",", integerVal) + decimalVal);
  emit("update:modelValue", value);
  updatePos = decimalPos >= 0 && target.value.substring(decimalPos).length > decimalVal.length;
  newPos = target.selectionStart ?? 0;
  if (updatePos) {
    target.value = integerVal + decimalVal;
  }
};

watch(
  () => props.modelValue,
  (val) => {
    if (val && inputRef.value) {
      const start = inputRef.value.selectionStart ?? 0;
      const end = inputRef.value.selectionEnd ?? 0;
      const length = inputVal.value.length;
      const deltaStart = length - start + 1;
      const deltaEnd = length - end + 1;
      inputVal.value = props.formatter(val);
      const newLength = inputVal.value.length;
      const newStart = inputVal.value.length - deltaStart + (newLength < length ? 2 : 0);
      const newEnd = inputVal.value.length - deltaEnd + (newLength < length ? 2 : 0);
      nextTick(() => {
        if (inputRef.value) {
          if (updatePos) {
            inputRef.value.setSelectionRange(newPos, newPos);
          } else {
            inputRef.value.setSelectionRange(newStart, newEnd);
          }
        }
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="cc-input cc-number-input" :class="[props.class]">
    <CcIcon v-if="icon" class="cc-input__icon" :name="icon" />
    <input
      ref="inputRef"
      :id="id"
      :name="id"
      :autocomplete="id"
      class="cc-input__control"
      :class="[{ 'cc-input--error': hasError || props.hasError }, componentClass]"
      type="text"
      :value="inputVal"
      :readonly="props.readonly || readonly"
      v-bind="$attrs"
      @[eventType]="updateValue($event.target as HTMLInputElement)"
    />
  </div>
</template>
