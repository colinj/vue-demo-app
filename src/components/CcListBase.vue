<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useMouseInElement, useVirtualList } from "@vueuse/core";
import type { ListItemType, ListValueType } from "@/types";

interface Props {
  modelValue?: ListValueType | undefined;
  items: ListItemType[];
  itemKey?: string;
  maxHeight?: number;
  required?: boolean;
  disabled?: boolean;
  child?: boolean;
  disableItem?: (index: number) => boolean;
}
const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  itemKey: "",
  child: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", v: ListValueType | undefined): void;
  (e: "select", v: ListItemType): void;
}>();

const getKeyValue = (v: ListItemType) => (typeof v === "object" ? (v[props.itemKey] as string | number) : v);

const keyValues = computed(() =>
  props.modelValue ? [props.modelValue].flatMap<ListItemType>((v) => v).map(getKeyValue) : []
);
const maxHeight = computed(() => (props.maxHeight ? `${props.maxHeight}px` : "none"));
const listItems = computed(() => props.items);

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(listItems, {
  itemHeight: 32,
  overscan: 10,
});

const listRef = ref<HTMLDivElement | null>(null);

const lastHighlighted = ref(0);
const highlighted = ref(0);

watch(listItems, () => (highlighted.value = 0), { immediate: true });

const scrollToItem = (index: number) => {
  if (index < 0) return;
  const el = listRef.value?.querySelector(`[data-index="${index}"]`);
  if (el) {
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  } else {
    scrollTo(index);
  }
};

const highlightItem = (index: number) => {
  if (index < 0) lastHighlighted.value = highlighted.value < 0 ? 0 : highlighted.value;
  highlighted.value = index;
  scrollToItem(index);
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
  scrollToItem(highlighted.value);
};
const highlightNext = computed(() => highlight((v) => v + 1, props.items.length, 0));
const highlightPrev = computed(() => highlight((v) => v - 1, -1, props.items.length - 1));

const { x, y, elementPositionX, elementPositionY, isOutside, elementHeight, elementWidth } = useMouseInElement(
  containerProps.ref
);

const getItemIndexAt = (x: number, y: number) => {
  const pos = containerProps.ref.value?.getBoundingClientRect();
  const [deltaX, deltaY] = pos ? [elementPositionX.value - pos.x, elementPositionY.value - pos.y] : [0, 0];
  return parseInt(document.elementFromPoint(x - deltaX, y - deltaY)?.getAttribute("data-index") ?? "");
};

watch([isOutside, x, y], ([isOutside, x, y]) => {
  if (!isOutside) {
    const index = getItemIndexAt(x, y);
    if (!isNaN(index) && index !== highlighted.value) {
      highlighted.value = Number(index);
    }
  }
});

const itemClasses = (item: ListItemType, index: number) => {
  return {
    "cc-list--highlighted": index === highlighted.value,
  };
};

const itemDisabled = (index: number) => (!props.disabled && props.disableItem && props.disableItem(index)) || undefined;

const selectItem = (item: ListItemType | undefined) => {
  if (item === undefined) {
    return;
  }
  if (Array.isArray(props.modelValue)) {
    const keyValue = getKeyValue(item);
    const foundItem = props.modelValue.find((x) => getKeyValue(x) === keyValue);
    const items = foundItem ? props.modelValue.filter((x) => x !== foundItem) : [...props.modelValue, item];
    if (!props.required || items.length > 0) {
      emit("update:modelValue", items);
    }
  } else {
    const selected = !props.required && item === props.modelValue ? undefined : item;
    emit("update:modelValue", selected);
  }
  emit("select", item);
};

const clickItem = () => {
  const index = getItemIndexAt(x.value, y.value);
  if (!isNaN(index)) {
    selectItem(props.items[index]);
  }
  scrollToItem(index);
};

defineExpose({
  highlightItem,
  highlightNext,
  highlightPrev,
  selectItem,
  selectHighlighted: () => selectItem(props.items[highlighted.value]),
  scrollTo,
  isOutside,
  elementHeight,
  elementWidth,
});
</script>

<template>
  <div
    v-bind="containerProps"
    class="cc-list"
    :class="{ 'cc-list--disabled': props.disabled }"
    :tabindex="props.disabled ? '-1' : '0'"
    :style="undefined"
    @mouseleave="highlightItem(-1)"
    @click="clickItem()"
    @keydown.up.prevent="highlightPrev()"
    @keydown.down.prevent="highlightNext()"
    @keydown.space.prevent="selectItem(props.items[highlighted])"
    @keydown.enter="selectItem(props.items[highlighted])"
    @blur="!props.child && highlightItem(-1)"
    @focus="highlighted < 0 && highlightItem(lastHighlighted)"
  >
    <ul
      ref="listRef"
      class="cc-list__container"
      v-bind="wrapperProps"
      role="listbox"
      :aria-multiselectable="Array.isArray(props.modelValue)"
      :aria-disabled="props.disabled || undefined"
    >
      <li v-if="list.length === 0" class="cc-list__empty">
        <slot name="emptyList"><em>List is empty</em></slot>
      </li>
      <template v-else>
        <li
          v-for="{ data: item, index } in list"
          :data-index="index"
          :key="index"
          class="cc-list__item"
          :class="itemClasses(item, index)"
          role="option"
          :aria-selected="keyValues.includes(getKeyValue(item))"
          :aria-disabled="itemDisabled(index)"
        >
          <slot v-bind="{ item, index }">{{ item }}</slot>
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.cc-list {
  max-height: v-bind("maxHeight");
}
</style>
