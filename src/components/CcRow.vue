<script setup lang="ts">
import { computed, ref } from "vue";

interface Props {
  header?: boolean;
  noHover?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  header: false,
  noHover: false,
});

const isActive = ref(false);

const rowClasses = computed(() => ({
  "cc-row--header": props.header,
  "cc-row--no-hover": props.noHover,
  "cc-row--active": isActive.value && !props.header,
}));
</script>

<template>
  <div
    class="cc-row"
    :class="rowClasses"
    @mousedown="isActive = true"
    @mouseup="isActive = false"
    @mouseout="isActive = false"
  >
    <slot :header="header" />
  </div>
</template>
