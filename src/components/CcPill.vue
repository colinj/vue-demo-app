<script setup lang="ts">
import { computed } from "vue";
import type { ColorKind, SizeType } from "@/types";
import CcIcon from "./CcIcon.vue";

interface Props {
  label?: string;
  bg?: ColorKind;
  fg?: ColorKind;
  size?: SizeType;
  border?: boolean;
  close?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  bg: "blue-500",
  fg: "blue-50",
  size: undefined,
  close: false,
});
const emit = defineEmits(["close"]);

const closeChip = () => {
  emit("close", props.label);
};

const pillClasses = computed(() => [props.size ? `cc-pill--${props.size}` : null, { "cc-pill--border": props.border }]);
const pillColors = computed(() => ({
  "--pill-color": `var(--${props.bg})`,
  "--pill-text": `var(--${props.fg})`,
}));
</script>

<template>
  <div class="cc-pill" :class="pillClasses" :style="pillColors">
    <slot>{{ props.label }}</slot>
    <button v-if="props.close" type="button" class="cc-pill__button" tabindex="-1" @click.stop="closeChip">
      <CcIcon name="xmark" size="1.1em" />
    </button>
  </div>
</template>
