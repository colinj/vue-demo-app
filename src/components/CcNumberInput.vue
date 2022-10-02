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

interface InputSelection {
  start: number;
  end: number;
  length?: number;
}

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
// const eventType = computed(() => (props.modelModifiers.lazy ? "change" : "input"));

const stripDelimiter = (delim: string, s: string) => s.replaceAll(delim, "");
const inputVal = ref("");
let oldInputVal = "";
let oldSelection: InputSelection = { start: 0, end: 0 };

const savePrevValue = (target: HTMLInputElement) => {
  oldInputVal = target.value;
  oldSelection = { start: target.selectionStart ?? 0, end: target.selectionEnd ?? 0 };
};

const VALID_KEYS = [
  "Digit0",
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "Period",
  "Minus",
  "ArrowLeft",
  "ArrowRight",
  "Backspace",
  "Delete",
  "KeyC",
  "KeyV",
  "KeyX",
];

const filterKeypress = (event: KeyboardEvent) => {
  if (!VALID_KEYS.includes(event.code)) {
    event.preventDefault();
  }
};

const updateValue = (target: HTMLInputElement) => {
  if (target.value === "") {
    inputVal.value = "";
    emit("update:modelValue", undefined);
    return;
  }
  const match = /^(-?[\d,]*)(\.\d*)?$/.exec(target.value);

  if (match === null) {
    target.value = oldInputVal;
    target.setSelectionRange(oldSelection.end, oldSelection.end);
    return;
  }

  const integerVal = match[1];
  const decVal = match[2] ?? "";
  const decimalVal = decVal.substring(0, props.decimalPlaces + 1);

  const value = Number(stripDelimiter(",", integerVal) + decimalVal);
  if (!isNaN(value)) {
    emit("update:modelValue", value);

    const selection = {
      start: target.selectionStart ?? 0,
      end: target.selectionEnd ?? 0,
      length: target.value.length,
    };

    let commaDeleted = 0;
    if (oldInputVal.length - selection.length === 1) {
      const sel = oldSelection.start - 1;
      if (oldInputVal.substring(sel, sel + 1) === ",") {
        commaDeleted = 1;
      }
    }

    inputVal.value = props.formatter(Math.trunc(value)) + decimalVal;
    target.value = inputVal.value;
    nextTick(() => {
      if (decVal.length > decimalVal.length) {
        target.setSelectionRange(selection.end, selection.end);
      } else {
        const length = target.value.length;
        const startPos = Math.max(length - (selection.length - selection.start) - commaDeleted, 0);
        target.setSelectionRange(startPos, startPos);
      }
    });
  }
};

watch(
  () => props.modelValue,
  (val) => {
    if (inputRef.value) {
      if (val) {
        inputVal.value = props.formatter(val);
      } else {
        inputVal.value = "";
      }
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
      @keydown="filterKeypress"
      @beforeinput="savePrevValue($event.target as HTMLInputElement)"
      @input="updateValue($event.target as HTMLInputElement)"
    />
  </div>
</template>
