<script setup lang="ts">
import { ref, watch } from "vue";

export type ListOptionType = string | Record<string, unknown>;
export type ListValueType = ListOptionType | ListOptionType[] | undefined | Record<string, unknown>;

export interface Props {
  modelValue?: ListValueType;
  options: ListOptionType[];
  maxHeight?: string;
  required?: boolean;
  disabled?: boolean;
  disableItem?: (index: number) => boolean;
}
const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", v: ListValueType): void;
  (e: "select", v: ListOptionType): void;
}>();

const listEl = ref<HTMLDivElement | null>(null);

const highlighted = ref(-1);
const highlightOption = (index: number) => {
  highlighted.value = index;
};

const highlightNext = () => {
  let x = highlighted.value;
  do {
    x++;
    if (x === props.options.length) x = 0;
  } while (props.disableItem && props.disableItem(x));
  highlighted.value = x;
};

const highlightPrev = () => {
  let x = highlighted.value;
  do {
    x--;
    if (x < 0) x = props.options.length - 1;
  } while (props.disableItem && props.disableItem(x));
  highlighted.value = x;
};

watch(highlighted, (val) => {
  const el = listEl.value?.querySelector(`[data-index="${val}"]`);
  if (el) el.scrollIntoView({ block: "nearest" });
});

const optionClasses = (option: ListOptionType, index: number) => {
  return {
    "cc-list--selected": Array.isArray(props.modelValue)
      ? props.modelValue.includes(option)
      : props.modelValue === option,
    "cc-list--highlighted": index === highlighted.value,
    "cc-list--disabled": !props.disabled && props.disableItem && props.disableItem(index),
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
  emit("select", option);
};
</script>

<template>
  <ul
    class="cc-list"
    ref="listEl"
    :class="{ 'cc-list--disabled': props.disabled }"
    :style="{ maxHeight: props.maxHeight }"
    :tabindex="props.disabled ? '-1' : '0'"
    @mouseleave="highlightOption(-1)"
    @keydown.up.prevent="highlightPrev()"
    @keydown.down.prevent="highlightNext()"
    @keydown.space="selectOption(props.options[highlighted])"
    @keydown.enter="selectOption(props.options[highlighted])"
  >
    <li v-if="props.options.length === 0" class="cc-list__empty">
      <slot name="noOptions"><em>List is empty</em></slot>
    </li>
    <template v-else>
      <li
        v-for="(option, index) in props.options"
        :data-index="index"
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
