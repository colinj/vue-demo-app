<script setup lang="ts">
import { ref } from "vue";
import type { MenuOption } from "@/types";
import MenuItem from "./MenuItem.vue";

const menuItems = ref<MenuOption[]>([
  {
    id: 1,
    title: "Home",
    icon: "house",
    to: { name: "home" },
  },
  {
    id: 2,
    title: "About",
    icon: "question",
    to: { name: "about" },
  },
]);
</script>

<template>
  <div class="nav-menu">
    <template v-for="menuItem in menuItems" :key="menuItem.id">
      <MenuItem :icon="menuItem.icon" :to="menuItem.to">
        <slot :menuItem="menuItem">{{ menuItem.title }}</slot>
      </MenuItem>
    </template>
  </div>
</template>
