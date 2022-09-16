<script setup lang="ts">
import { useElementBounding, useMouseInElement } from "@vueuse/core";
import { computed, ref } from "vue";

interface Props {
  text?: string;
  pos?: "top" | "bottom";
}
const props = withDefaults(defineProps<Props>(), {
  pos: "top",
});

const targetRef = ref<HTMLElement | null>(null);
const { elementPositionX, elementPositionY, elementHeight, elementWidth, isOutside } = useMouseInElement(targetRef);

const tooltipRef = ref(null);
const { x, width, height } = useElementBounding(tooltipRef);

const tooltipStyle = computed(() =>
  props.pos === "top"
    ? {
        top: `${elementPositionY.value - height.value - 8}px`,
        left: `${Math.max(elementPositionX.value + (elementWidth.value - width.value) / 2, 4)}px`,
        "--tt-caret-top": `${height.value - 8}px`,
        "--tt-caret-left": `${(elementWidth.value - 12) / 2 + elementPositionX.value - x.value}px`,
        "--tt-caret-rotate": "0deg",
      }
    : {
        top: `${elementPositionY.value + elementHeight.value + 8}px`,
        left: `${Math.max(elementPositionX.value + (elementWidth.value - width.value) / 2, 4)}px`,
        "--tt-caret-top": `-10px`,
        "--tt-caret-left": `${(elementWidth.value - 12) / 2 + elementPositionX.value - x.value}px`,
        "--tt-caret-rotate": "180deg",
      }
);
</script>

<template>
  <div ref="targetRef" class="cc-tooltip" aria-describedby="id123">
    <slot name="target" />
  </div>
  <teleport to="body">
    <div
      ref="tooltipRef"
      role="tooltip"
      id="id123"
      class="cc-tooltip__content"
      :class="{ 'cc-tooltip--active': !isOutside }"
      :style="tooltipStyle"
    >
      <slot>{{ props.text }}</slot>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.cc-tooltip {
  display: inline;

  cursor: pointer;

  &__content {
    position: absolute;
    z-index: 100;

    display: inline-block;

    max-width: min(100% - 8px, 300px);
    padding: 2px 6px;

    font-size: 0.75rem;

    border-radius: 4px;

    background-color: color(grey-200);

    opacity: 0;
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.4));

    transition: opacity 0.3s ease-in-out;

    &::before {
      position: absolute;
      top: var(--tt-caret-top);
      left: var(--tt-caret-left);
      content: "▼";

      color: color(grey-200);
      font-size: 12px;

      transform: rotate(var(--tt-caret-rotate)) scaleX(1.3);
    }
  }

  &--active {
    opacity: 1;

    transition: opacity 0.3s ease-in-out 0.6s;
  }
}
</style>
