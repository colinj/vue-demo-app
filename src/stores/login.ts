import type { LoginUser } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { loginUsers } from "@/utils/login-users";
import { sleep } from "@/utils/sleep";

export const useLoginStore = defineStore("login", () => {
  const loggedInUser = ref<LoginUser | null>(null);
  const loginAttempts = ref(0);

  const login = async (username: string, password: string) => {
    loggedInUser.value = loginUsers.find((user) => user.username === username && user.password === password) ?? null;
    loginAttempts.value = loggedInUser.value ? 0 : loginAttempts.value + 1;
    await sleep(1500);
    return loggedInUser.value !== null;
  };

  const logout = () => {
    loggedInUser.value = null;
  };

  const hasPermission = (permission: string) => {
    return permission === "public" || loggedInUser.value !== null;
  };

  return {
    loggedInUser,
    loginAttempts,
    login,
    logout,
    hasPermission,
  };
});
