<script setup lang="ts">
import { computed, onUpdated, ref, watch } from "vue";
import CcIcon from "./CcIcon.vue";

// When index is assigned, opening a panel will automatically close other grouped panels.
// When index is unassigned, other grouped panels will act independently from remain opened at the same time.
interface Props {
  modelValue?: number | boolean;
  toggle?: boolean | "right";
  target?: "header" | "toggle";
  index?: number;
  active?: boolean;
  connected?: boolean;
  separator?: boolean;
  hover?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  toggle: false,
  target: "header",
  connected: false,
  separator: false,
});
const emit = defineEmits(["update:modelValue", "click"]);

const isOpen = ref(false);
const height = ref("0");
const overflowStyle = ref(false);
const pressDown = ref(false);

const updateState = (val?: boolean) => {
  isOpen.value = val ?? !isOpen.value;
  setTimeout(
    () => {
      overflowStyle.value = isOpen.value;
    },
    isOpen.value ? 200 : 0
  );
};
const toggle = (val?: boolean) => {
  if (typeof props.modelValue === "boolean") {
    emit("update:modelValue", val ?? !isOpen.value);
  } else if (props.index !== undefined) {
    emit("update:modelValue", isOpen.value ? -1 : props.index);
  }
  updateState(val);
};

const accordionClasses = computed(() => [
  `cc-accordion--${props.target}`,
  {
    "cc-accordion--open": isOpen.value,
    "cc-accordion--active": props.active,
    "cc-accordion--connected": props.connected,
    "cc-accordion--separator": props.separator,
    "cc-accordion--allow-hover": props.hover,
    "cc-accordion--press-down": props.hover && pressDown.value,
  },
]);

watch(
  () => props.modelValue,
  (val) => {
    if (typeof val === "boolean") {
      updateState(val);
    } else {
      props.index !== undefined && updateState(props.index === val);
    }
  },
  { immediate: true }
);

const panel = ref<HTMLElement | null>(null);
onUpdated(() => {
  if (isOpen.value) {
    height.value = panel.value?.scrollHeight + "px";
  }
});
</script>

<template>
  <div class="cc-accordion" :class="accordionClasses">
    <div
      class="cc-accordion__header"
      @mousedown="pressDown = true"
      @mouseup="pressDown = false"
      @mouseout="pressDown = false"
      @click="props.target === 'header' ? toggle() : emit('click', $event)"
    >
      <div class="cc-accordion__toggle pl-5" @click.stop="toggle()">
        <template v-if="props.toggle === true">
          <CcIcon class="icon-normal mr-5" name="chevron-down" />
          <CcIcon class="icon-hover mr-5" name="chevron-down" size="1.1em" />
        </template>
      </div>
      <div class="cc-accordion__header-content">
        <slot name="header" :isOpen="isOpen" :toggle="toggle" />
      </div>
      <div class="cc-accordion__toggle pr-5" @click.stop="toggle()">
        <template v-if="props.toggle === 'right'">
          <CcIcon class="icon-normal ml-5" name="chevron-down" />
          <CcIcon class="icon-hover ml-5" name="chevron-down" size="1.1em" />
        </template>
      </div>
    </div>
    <div ref="panel" class="cc-accordion__content" :style="{ overflow: overflowStyle ? 'visible' : undefined }">
      <div class="cc-accordion__inner-content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cc-accordion {
  &--open {
    .cc-accordion__content {
      height: v-bind("height");
    }
  }
}
</style>
