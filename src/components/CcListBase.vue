<script setup lang="ts">
import { ref, watch } from "vue";
import { useVirtualList } from "@vueuse/core";

type ListOptionType = string | Record<string, unknown>;
type ListValueType = ListOptionType | ListOptionType[] | undefined | Record<string, unknown>;

interface Props {
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

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(props.options, {
  itemHeight: 32,
  overscan: 10,
});

const listEl = ref<HTMLDivElement | null>(null);

const highlighted = ref(-1);
const lastHighlighted = ref(-1);
const highlightOption = (index: number) => {
  if (index < 0) lastHighlighted.value = highlighted.value;
  highlighted.value = index;
};

const highlightNext = () => {
  if (highlighted.value < 0) {
    highlighted.value = lastHighlighted.value;
    return;
  }

  let x = highlighted.value;
  do {
    x++;
    if (x === props.options.length) x = 0;
  } while (props.disableItem && props.disableItem(x));
  highlighted.value = x;
};

const highlightPrev = () => {
  if (highlighted.value < 0) {
    highlighted.value = lastHighlighted.value;
    return;
  }

  let x = highlighted.value;
  do {
    x--;
    if (x < 0) x = props.options.length - 1;
  } while (props.disableItem && props.disableItem(x));
  highlighted.value = x;
};

watch(highlighted, (val) => {
  if (val < 0) return;
  const el = listEl.value?.querySelector(`[data-index="${val}"]`);
  if (el) {
    el.scrollIntoView({ block: "nearest" });
  } else {
    scrollTo(val);
  }
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
  <div
    v-bind="containerProps"
    class="cc-list"
    :class="{ 'cc-list--disabled': props.disabled }"
    :style="undefined"
    :tabindex="props.disabled ? '-1' : '0'"
    @mouseleave="highlightOption(-1)"
    @keydown.up.prevent="highlightPrev()"
    @keydown.down.prevent="highlightNext()"
    @keydown.space.prevent="selectOption(props.options[highlighted])"
    @keydown.enter="selectOption(props.options[highlighted])"
  >
    <ul v-bind="wrapperProps" ref="listEl" class="cc-list__container">
      <li v-if="list.length === 0" class="cc-list__empty">
        <slot name="noOptions"><em>List is empty</em></slot>
      </li>
      <template v-else>
        <li
          v-for="{ data: option, index } in list"
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
  </div>
</template>

<style lang="scss" scoped>
.cc-list {
  max-height: v-bind("props.maxHeight");
}
</style>
