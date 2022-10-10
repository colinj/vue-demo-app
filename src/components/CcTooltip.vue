<script setup lang="ts">
import { useElementBounding, useMouseInElement } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { uniqueId } from "@/utils/unique-id";

interface Props {
  text?: string;
  pos?: "top" | "bottom";
  hover?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  pos: "top",
  hover: false,
});

const id = uniqueId("tooltip");
const targetRef = ref<HTMLElement | null>(null);
const { elementPositionX, elementPositionY, elementHeight, elementWidth, isOutside } = useMouseInElement(targetRef);

const tooltipRef = ref(null);
const { x, width, height, update } = useElementBounding(tooltipRef);

const clicked = ref(false);

const clickTarget = () => {
  if (!props.hover) clicked.value = true;
};

watch(isOutside, (val) => {
  if (clicked.value && val) {
    clicked.value = false;
  } else {
    update();
  }
});

const tooltipStyle = computed(() =>
  props.pos === "top"
    ? {
        top: `${elementPositionY.value - height.value - 8}px`,
        left: `${Math.max(elementPositionX.value + (elementWidth.value - width.value) / 2, 4)}px`,
        "--tt-caret-top": `${height.value - 6}px`,
        "--tt-caret-left": `${(elementWidth.value - 12) / 2 + elementPositionX.value - x.value}px`,
        "--tt-caret-rotate": "0deg",
        "--tt-caret-shadow": "1px",
        "--tt-delay": props.hover ? "0.6s" : "0s",
      }
    : {
        top: `${elementPositionY.value + elementHeight.value + 8}px`,
        left: `${Math.max(elementPositionX.value + (elementWidth.value - width.value) / 2, 4)}px`,
        "--tt-caret-top": `-12px`,
        "--tt-caret-left": `${(elementWidth.value - 12) / 2 + elementPositionX.value - x.value}px`,
        "--tt-caret-rotate": "180deg",
        "--tt-caret-shadow": "-1px",
        "--tt-delay": props.hover ? "0.6s" : "0s",
      }
);
</script>

<template>
  <div ref="targetRef" class="cc-tooltip" :aria-describedby="id" @click="clickTarget()">
    <slot name="target" />
  </div>
  <teleport to="body">
    <div
      ref="tooltipRef"
      role="tooltip"
      :id="id"
      class="cc-tooltip__content"
      :class="{ 'cc-tooltip--active': !isOutside && (props.hover || clicked) }"
      :style="tooltipStyle"
    >
      <slot>{{ props.text }}</slot>
    </div>
  </teleport>
</template>
