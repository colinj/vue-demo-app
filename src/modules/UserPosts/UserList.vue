<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { computed } from "vue";
import CcRow from "@/components/CcRow.vue";

const userStore = useUserStore();

const users = computed(() => userStore.users);
</script>

<template>
  <div class="p-10">
    <h1>List of users</h1>
    <div class="mt-6">
      <CcRow v-for="user in users" :key="user.id">
        <span>{{ user.id }}</span>
        <span>{{ user.name }}</span>
      </CcRow>
    </div>
  </div>
</template>
