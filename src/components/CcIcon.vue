<script setup lang="ts">
import { computed } from "vue";
import type { IconKind, IconName, ColorKind } from "@/types";

interface Props {
  name: IconName;
  size?: string;
  color?: ColorKind;
  kind?: IconKind;
}
const props = withDefaults(defineProps<Props>(), {
  kind: "solid",
});

const iconStyles = computed(() => ({
  height: props.size,
  width: props.size,
  color: props.color ? `var(--${props.color})` : undefined,
}));
const iconHref = computed(() => `/src/assets/fontawesome/${props.kind}.svg#${props.name}`);
</script>

<template>
  <svg class="cc-icon" :style="iconStyles">
    <use :xlink:href="iconHref" />
  </svg>
</template>
