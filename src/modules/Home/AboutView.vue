<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
</script>

<template>
  <div class="about">
    <HelloWorld class="p-10" msg="Demo App" />
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    display: flex;
    flex-direction: column;
    align-items: center;

    min-height: calc(100vh - 56px);
  }
}
</style>
