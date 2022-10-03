<script setup lang="ts">
import { ref } from "vue";
import AppHeader from "@/modules/App/AppHeader.vue";

const showSideMenu = ref(false);
</script>

<template>
  <div class="app-layout page-layout">
    <div class="app-layout__header">
      <AppHeader v-model="showSideMenu" />
    </div>

    <div class="app-layout__sidebar" :class="{ open: showSideMenu }">
      <RouterView v-slot="{ Component }" name="menu">
        <Transition name="fade">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>

    <div class="app-layout__content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade">
          <component :is="Component" />
        </Transition>
      </RouterView>
      <div class="menu-overlay" :class="{ 'menu-overlay--show': showSideMenu }" @click="showSideMenu = false"></div>
    </div>
  </div>
</template>
