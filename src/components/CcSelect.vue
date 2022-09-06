<script setup lang="ts">
import { ref } from "vue";
import CcIcon from "./CcIcon.vue";

const inputValue = ref("");
const isOpen = ref(false);

const toggleMenu = (val?: boolean) => {
  isOpen.value = val === undefined ? !isOpen.value : val;
};
</script>

<template>
  <div>
    <div ref="selectEl" class="cc-select" :class="{ 'cc-select--open': isOpen }">
      <input class="cc-select__input" v-model="inputValue" />
      <button class="cc-select__toggle" @click="toggleMenu()">
        <CcIcon name="chevron-down" />
      </button>
      <ul v-if="isOpen" class="cc-option">
        <li>Tom</li>
        <li>Jane</li>
        <li>Peter</li>
        <li>Mary</li>
        <li>Jordan</li>
        <li>Polly</li>
        <li>Amanda</li>
        <li>Billy</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cc-select {
  position: relative;

  display: flex;
  align-items: center;

  padding: 4px 8px;

  border: 1px solid black;
  border-radius: $border-radius-sm;

  &__input {
    width: 100%;
  }

  &__toggle {
    display: grid;
    place-content: center;

    background-color: transparent;

    svg {
      transition: transform 0.2s ease;
    }
  }

  &--open {
    .cc-select__toggle svg {
      transform: rotate(180deg);
    }
  }
}

.cc-option {
  position: absolute;

  padding: 4px 8px;

  border: 1px solid black;
  border-radius: $border-radius-sm;

  background-color: #fff;
}
</style>
