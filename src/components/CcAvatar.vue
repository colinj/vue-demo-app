<script setup lang="ts">
import { computed } from "vue";
import CcIcon from "./CcIcon.vue";

interface Props {
  name?: string;
  imgSrc?: string;
  large?: boolean;
}
const props = defineProps<Props>();

const initials = computed(() => {
  return props.name
    ?.split(" ")
    .filter((s) => s)
    .map((s) => s.substring(0, 1).toUpperCase())
    .join("");
});
</script>

<template>
  <div class="cc-avatar" :title="props.name" :class="props.large && 'cc-avatar--lg'">
    <CcIcon v-if="!name && !imgSrc" name="user" :size="props.large ? '24px' : '16px'" />
    <img v-else-if="props.imgSrc" :src="props.imgSrc" :alt="props.name" :title="props.name" />
    <span v-else>{{ initials }}</span>
  </div>
</template>
