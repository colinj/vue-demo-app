<script setup lang="ts">
import { computed, ref } from "vue";

type SelectOptionType = string | Record<string, unknown>;

type SelectValueType = SelectOptionType | SelectOptionType[] | undefined;

interface Props {
  modelValue?: SelectValueType;
  options: SelectOptionType[];
  optionKey?: string;
  label?: string | ((option: Record<string, unknown>) => string);
  allowEmpty?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  allowEmpty: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", v: SelectValueType): void;
}>();

const highlighted = ref(-1);

const getLabelFn = computed(() => {
  if (props.label !== undefined) {
    if (typeof props.label === "function") {
      return props.label;
    } else {
      const key = props.label;
      return (option: Record<string, unknown>) => option[key] as string;
    }
  }
  return () => "label property undefined for options object array";
});

const getLabel = (option: SelectOptionType | undefined) =>
  option === undefined || typeof option === "string" ? option ?? "" : getLabelFn.value(option);
const getKey = (option: SelectOptionType | undefined) =>
  option === undefined || typeof option === "string"
    ? option
    : props.optionKey
    ? option[props.optionKey]
    : getLabel(option);

const optionClasses = (option: SelectOptionType, index: number) => {
  return {
    "cc-list--selected": Array.isArray(props.modelValue)
      ? props.modelValue.includes(option)
      : props.modelValue === option,
    "cc-list--highlighted": index === highlighted.value,
  };
};
const selectOption = (option: SelectOptionType | undefined) => {
  if (option === undefined) {
    return;
  }
  if (Array.isArray(props.modelValue)) {
    const key = getKey(option);
    const foundItem = key && props.modelValue.find((x) => getKey(x) === key);
    const items = foundItem ? props.modelValue.filter((x) => x !== foundItem) : [...props.modelValue, option];
    if (props.allowEmpty || items.length > 0) {
      emit("update:modelValue", items);
    }
  } else {
    const selected = props.allowEmpty && option === props.modelValue ? undefined : option;
    emit("update:modelValue", selected);
  }
};

const highlightOption = (index: number) => {
  highlighted.value = index;
};
const highlightNext = () => {
  highlighted.value = highlighted.value < props.options.length - 1 ? highlighted.value + 1 : 0;
};

const highlightPrev = () => {
  highlighted.value = highlighted.value > 0 ? highlighted.value - 1 : props.options.length - 1;
};
</script>

<template>
  <ul
    class="cc-list"
    tabindex="-1"
    @mouseleave="highlightOption(-1)"
    @keydown.up="highlightPrev()"
    @keydown.down="highlightNext()"
    @keydown.space="selectOption(props.options[highlighted])"
    @keydown.enter="selectOption(props.options[highlighted])"
  >
    <li v-if="props.options.length === 0" class="cc-list__empty">
      <slot name="noOptions"><em>List is empty</em></slot>
    </li>
    <template v-else>
      <li
        v-for="(option, index) in props.options"
        :key="getLabel(option)"
        class="cc-list__item"
        :class="optionClasses(option, index)"
        @click="selectOption(option)"
        @mouseenter="highlightOption(index)"
      >
        {{ getLabel(option) }}
      </li>
    </template>
  </ul>
</template>
