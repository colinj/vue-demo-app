<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useMouseInElement, useVirtualList } from "@vueuse/core";

type ListOptionType = string | Record<string, unknown>;
type ListValueType = ListOptionType | ListOptionType[];

interface Props {
  modelValue?: ListValueType | undefined;
  options: ListOptionType[];
  optionKey?: string;
  maxHeight?: string;
  required?: boolean;
  disabled?: boolean;
  disableItem?: (index: number) => boolean;
}
const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  optionKey: "",
});
const emit = defineEmits<{
  (e: "update:modelValue", v: ListValueType | undefined): void;
  (e: "select", v: ListOptionType): void;
}>();

const getKeyValue = (v: ListOptionType) => (typeof v === "object" ? (v[props.optionKey] as string | number) : v);

const keyValues = computed(() =>
  props.modelValue ? [props.modelValue].flatMap<ListOptionType>((v) => v).map(getKeyValue) : []
);

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(props.options, {
  itemHeight: 32,
  overscan: 10,
});

const listEl = ref<HTMLDivElement | null>(null);

const lastHighlighted = ref(0);
const highlighted = ref(-1);
const highlightOption = (index: number) => {
  if (index < 0) lastHighlighted.value = highlighted.value < 0 ? 0 : highlighted.value;
  highlighted.value = index;
};

const highlight = (updateVal: (val: number) => number, limit: number, resetVal: number) => () => {
  if (highlighted.value < 0) {
    highlighted.value = lastHighlighted.value;
  } else {
    let pos = highlighted.value;
    do {
      pos = updateVal(pos);
      if (pos === limit) pos = resetVal;
    } while (props.disableItem && props.disableItem(pos));
    highlighted.value = pos;
  }
};
const highlightNext = highlight((v) => v + 1, props.options.length, 0);
const highlightPrev = highlight((v) => v - 1, -1, props.options.length - 1);

watch(highlighted, (val) => {
  if (val < 0) return;
  const el = listEl.value?.querySelector(`[data-index="${val}"]`);
  if (el) {
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  } else {
    scrollTo(val);
  }
});

const { x, y, isOutside } = useMouseInElement(containerProps.ref);
watch([isOutside, x, y], ([isOutside, x, y]) => {
  if (!isOutside) {
    const index = parseInt(document.elementFromPoint(x, y)?.getAttribute("data-index") ?? "");
    if (!isNaN(index) && index !== highlighted.value) {
      highlighted.value = Number(index);
    }
  }
});

const optionClasses = (option: ListOptionType, index: number) => {
  return {
    "cc-list--selected": keyValues.value.includes(getKeyValue(option)),
    "cc-list--highlighted": index === highlighted.value,
    "cc-list--disabled": !props.disabled && props.disableItem && props.disableItem(index),
  };
};

const selectOption = (option: ListOptionType | undefined) => {
  if (option === undefined) {
    return;
  }
  if (Array.isArray(props.modelValue)) {
    const keyValue = getKeyValue(option);
    const foundItem = props.modelValue.find((x) => getKeyValue(x) === keyValue);
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

const clickOption = () => {
  const index = parseInt(document.elementFromPoint(x.value, y.value)?.getAttribute("data-index") ?? "");
  if (!isNaN(index)) {
    selectOption(props.options[index]);
  }
};
</script>

<template>
  <div
    v-bind="containerProps"
    class="cc-list"
    :class="{ 'cc-list--disabled': props.disabled }"
    :tabindex="props.disabled ? '-1' : '0'"
    :style="undefined"
    @mouseleave="highlightOption(-1)"
    @click="clickOption()"
    @keydown.up.prevent="highlightPrev()"
    @keydown.down.prevent="highlightNext()"
    @keydown.space.prevent="selectOption(props.options[highlighted])"
    @keydown.enter="selectOption(props.options[highlighted])"
    @blur="highlightOption(-1)"
    @focus="highlighted < 0 && highlightOption(lastHighlighted)"
  >
    <ul ref="listEl" class="cc-list__container" v-bind="wrapperProps">
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
