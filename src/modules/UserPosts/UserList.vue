<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import type { UserId } from "@/types";
import CcRow from "@/components/CcRow.vue";

const store = useUserStore();

const users = computed(() => store.users);
const router = useRouter();

const gotoUser = (userId: UserId) => {
  router.push({ name: "user", params: { userId } });
};
</script>

<template>
  <div class="p-10">
    <h1>List of users</h1>
    <div class="mt-6">
      <CcRow v-for="user in users" :key="user.id" @click="gotoUser(user.id)">
        <span>{{ user.id }}</span>
        <span>{{ user.name }}</span>
      </CcRow>
    </div>
  </div>
</template>
