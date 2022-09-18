<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { onClickOutside, useElementBounding, useTimeoutFn } from "@vueuse/core";
import type { MenuOption } from "@/types";
import CcList from "./CcList.vue";

const MIN_WIDTH = 200;

interface Props {
  modelValue?: string | number;
  options: (number | string | MenuOption)[];
  menuPos?: "left" | "right" | "center";
  maxHeight?: number;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  maxHeight: 322,
  disabled: false,
  menuPos: "center",
});
const emit = defineEmits<{
  (e: "update:modelValue", v: string | number): void;
}>();

const menuOptions = computed(() => {
  return props.options.map((opt) => (typeof opt === "object" ? opt : { id: opt, title: opt.toString() }));
});
const menuValue = ref<MenuOption>();

const isCreated = ref(false);
const isOpen = ref(false);

const { start: removeMenu, stop: keepMenu } = useTimeoutFn(() => (isCreated.value = false), 5000, { immediate: false });

const menuRef = ref<InstanceType<typeof CcList> | null>(null);
const toggleMenu = (val?: boolean) => {
  if (val === isOpen.value) return;

  isOpen.value = val === undefined ? !isOpen.value : val;
  if (isOpen.value) {
    keepMenu();
    isCreated.value = true;
    update();
    const index = menuOptions.value.findIndex((x) => x.id === props.modelValue);
    nextTick(() => {
      menuRef.value?.highlightItem(index < 0 ? 0 : index);
    });
  } else {
    enteredMenu.value = false;
    removeMenu();
  }
};

const targetRef = ref<HTMLElement | null>(null);
onClickOutside(targetRef, () => {
  if (isOpen.value && menuRef.value?.isOutside) {
    setTimeout(() => toggleMenu(false), 5);
  }
});
const { top, left, height, width, update } = useElementBounding(targetRef);
const menuBelow = computed(
  () => window.innerHeight - top.value > Math.min(32 * (props.options.length + 1), props.maxHeight)
);
const optionsPos = computed(() => {
  const menuWidth = menuRef.value?.elementWidth ?? MIN_WIDTH;
  const menuHeight = menuRef.value?.elementHeight ?? 0;
  const body = document.body.getBoundingClientRect();
  const menuTop = top.value - body.top + (menuBelow.value ? height.value + 10 : -menuHeight - 28);

  const leftDelta =
    props.menuPos === "left" ? 0 : props.menuPos === "right" ? width.value - menuWidth : (width.value - menuWidth) / 2;
  const menuLeft = Math.max(Math.min(left.value + leftDelta, window.innerWidth - menuWidth - 20), 0);
  const caretLeft = left.value - menuLeft + (width.value - 16) / 2;
  return {
    top: `${menuTop}px`,
    width: `${Math.max(width.value, MIN_WIDTH)}px`,
    left: `${menuLeft}px`,
    "--tt-caret-top": menuBelow.value ? "-14px" : `${menuHeight + 12}px`,
    "--tt-caret-left": `${caretLeft}px`,
    "--tt-caret-rotate": menuBelow.value ? "180deg" : "0deg",
  };
});

const selectClasses = computed(() => ({
  "cc-dropdown--open": isOpen.value,
  "cc-dropdown--bottom": menuBelow.value,
  "cc-dropdown--top": !menuBelow.value,
}));

const updateValue = (option: MenuOption) => {
  emit("update:modelValue", option.id);
  toggleMenu(false);
};

const enteredMenu = ref(false);
watch(
  () => !menuRef.value?.isOutside,
  (insideMenu) => {
    if (isOpen.value) {
      if (insideMenu) {
        enteredMenu.value = true;
      } else if (enteredMenu.value) {
        toggleMenu(false);
      }
    }
  }
);
</script>

<template>
  <div ref="targetRef" class="cc-dropdown" :class="selectClasses" @click="toggleMenu()">
    <slot />
  </div>
  <teleport to="body">
    <div v-if="isCreated" class="cc-dropdown__menu" :class="{ open: isOpen }" :style="optionsPos">
      <CcList
        v-model="menuValue"
        ref="menuRef"
        class="cc-dropdown__inner"
        :items="menuOptions"
        item-key="id"
        :max-height="props.maxHeight"
        v-slot="{ item }"
        child
        @select="updateValue($event)"
      >
        {{ item.title }}
      </CcList>
    </div>
  </teleport>
</template>
