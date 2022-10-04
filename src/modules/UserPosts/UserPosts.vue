<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import CcRow from "@/components/CcRow.vue";
import CcButton from "@/components/CcButton.vue";

const store = useUserStore();
</script>

<template>
  <div class="p-10">
    <CcButton kind="link" icon="arrow-left-long" to="/users">Back to user list</CcButton>
    <h1 class="mt-6">User Posts</h1>
    <h2 class="mt-2">{{ store.user?.name }}</h2>
    <div class="mt-6">
      <CcRow v-for="post in store.posts" :key="post.id">
        <span>{{ post.id }}</span>
        <span>{{ post.title }}</span>
      </CcRow>
    </div>
  </div>
</template>
