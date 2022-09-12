<script setup lang="ts">
import { ref } from "vue";

export type ListOptionType = string | Record<string, unknown>;
export type ListValueType = ListOptionType | ListOptionType[] | undefined | Record<string, unknown>;

export interface Props {
  modelValue?: ListValueType;
  options: ListOptionType[];
  required?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  required: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", v: ListValueType): void;
}>();

const highlighted = ref(-1);

const optionClasses = (option: ListOptionType, index: number) => {
  return {
    "cc-list--selected": Array.isArray(props.modelValue)
      ? props.modelValue.includes(option)
      : props.modelValue === option,
    "cc-list--highlighted": index === highlighted.value,
  };
};
const selectOption = (option: ListOptionType | undefined) => {
  if (option === undefined) {
    return;
  }
  if (Array.isArray(props.modelValue)) {
    const foundItem = props.modelValue.find((x) => x === option);
    const items = foundItem ? props.modelValue.filter((x) => x !== foundItem) : [...props.modelValue, option];
    if (!props.required || items.length > 0) {
      emit("update:modelValue", items);
    }
  } else {
    const selected = !props.required && option === props.modelValue ? undefined : option;
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
    tabindex="0"
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
        :key="index"
        class="cc-list__item"
        :class="optionClasses(option, index)"
        @click="selectOption(option)"
        @mouseenter="highlightOption(index)"
      >
        <slot v-bind="{ option, index }">{{ option }}</slot>
      </li>
    </template>
  </ul>
</template>
