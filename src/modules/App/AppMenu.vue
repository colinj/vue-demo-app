<script setup lang="ts">
import { computed } from "vue";
import type { MenuOption } from "@/types";
import MenuItem from "./MenuItem.vue";
import { useLoginStore } from "@/stores/login";

const menuItems: MenuOption[] = [
  {
    id: 1,
    title: "Home",
    icon: "house",
    to: { name: "home" },
    permission: "public",
  },
  {
    id: 2,
    title: "Create User",
    icon: "user",
    to: { name: "createUser" },
    permission: "private",
  },
  {
    id: 3,
    title: "Users",
    icon: "users",
    to: { name: "users" },
    permission: "private",
  },
  {
    id: 9,
    title: "About",
    icon: "question",
    to: { name: "about" },
    permission: "public",
  },
];

const loginStore = useLoginStore();
const menu = computed(() => menuItems.filter((m) => loginStore.hasPermission(m.permission ?? "public")));
</script>

<template>
  <div class="nav-menu">
    <template v-for="menuItem in menu" :key="menuItem.id">
      <MenuItem :icon="menuItem.icon" :to="menuItem.to">
        <slot :menuItem="menuItem">{{ menuItem.title }}</slot>
      </MenuItem>
    </template>
  </div>
</template>
