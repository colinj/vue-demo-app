<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "@/stores/login";
import CcButton from "@/components/CcButton.vue";
import CcInput from "@/components/CcInput.vue";

const store = useLoginStore();
const router = useRouter();
const username = ref("");
const password = ref("");
const errorMsg = ref("");

const pending = ref(false);
const signIn = async () => {
  errorMsg.value = "";
  pending.value = true;
  try {
    if (await store.login(username.value, password.value)) {
      router.push("/");
    } else {
      errorMsg.value = "Your username or passwword was incorrect. Please try again.";
    }
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <div class="login">
    <div class="login__back">
      <CcButton kind="link" icon="arrow-left-long" to="/">Back to home</CcButton>
    </div>
    <form class="login__panel">
      <h1>Welcome to Demo App</h1>
      <CcInput v-model="username" icon="user" placeholder="user name" />
      <CcInput v-model="password" type="password" icon="eye" placeholder="password" />
      <CcButton kind="primary" :loading="pending" @click="signIn()">Sign in</CcButton>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100vh;
  padding: 40px;

  text-align: center;

  &__back {
    align-self: flex-start;
  }

  &__panel {
    width: 500px;
    margin-top: 20vh;
    padding: 2rem;

    border: 1px solid color(orange-200);
    border-radius: $border-radius-lg;

    background-color: color(orange-50);

    > * + * {
      margin-top: 1.5rem;
    }
  }
}
</style>
