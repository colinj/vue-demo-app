<script setup lang="ts">
import { computed } from "vue";
import type { IconKind, ColorKind } from "@/types";

interface Props {
  name: IconKind;
  size?: string;
  color?: ColorKind;
}
const props = defineProps<Props>();
const iconStyles = computed(() => ({
  height: props.size,
  width: props.size,
  color: props.color ? `var(--${props.color})` : undefined,
}));
const iconHref = computed(() => `/src/assets/fontawesome/solid.svg#${props.name}`);
</script>

<template>
  <svg class="cc-icon" :style="iconStyles">
    <use :xlink:href="iconHref" />
  </svg>
</template>
