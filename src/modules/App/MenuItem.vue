<script setup lang="ts">
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";
import type { IconName } from "@/types";
import CcIcon from "../../components/CcIcon.vue";

interface Props {
  to?: RouteLocationRaw;
  label?: string;
  icon?: IconName;
  header?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  label: "Menu Item",
  icon: undefined,
  header: false,
});

const tag = computed(() => (props.to && !props.header ? "router-link" : "div"));
const menuClass = computed(() => (props.header ? "nav-menu__header" : "nav-menu__item"));
</script>

<template>
  <component :is="tag" :class="[menuClass]" :to="props.to">
    <CcIcon v-if="props.icon" :name="props.icon" />
    <slot>
      {{ props.label }}
    </slot>
  </component>
</template>
