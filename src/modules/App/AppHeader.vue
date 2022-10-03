<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import CcAvatar from "@/components/CcAvatar.vue";

interface Props {
  modelValue: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
}>();

const route = useRoute();

watch(
  route,
  () => {
    emit("update:modelValue", false);
  },
  { immediate: true }
);
</script>

<template>
  <div class="app-header">
    <div class="align-center">
      <div class="app-header__menu-toggle">
        <div
          class="pr-2"
          :class="{ 'menu-toggle--open': props.modelValue }"
          @click="emit('update:modelValue', !props.modelValue)"
        >
          <div class="menu-toggle"></div>
        </div>
      </div>
      <RouterLink class="app-header__logo" to="/">
        <h2>Demo App</h2>
      </RouterLink>
    </div>
    <div class="app-header__spacer" />
    <div class="app-header__user">
      <CcAvatar />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  display: flex;
  gap: 0 40px;
  align-items: center;

  height: 100%;
  padding: 16px 28px 16px 16px;

  &__logo {
    text-decoration: none;
  }

  &__menu-toggle {
    display: none;
  }

  &__spacer {
    flex-grow: 1;
  }

  &__user {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  a {
    color: #fff;
  }

  @media (max-width: 992px) {
    &__menu-toggle {
      display: block;

      cursor: pointer;
    }
  }

  @media (max-width: 640px) {
    gap: 0 16px;
  }
}
</style>
