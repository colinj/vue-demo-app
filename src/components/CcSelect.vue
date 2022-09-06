<script setup lang="ts">
import { computed, ref } from "vue";
import { onClickOutside, useElementBounding, useTemplateRefsList } from "@vueuse/core";
import CcIcon from "./CcIcon.vue";

interface Props {
  modelValue?: string | undefined;
  options: string[];
  allowEmpty?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  allowEmpty: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", v: string | undefined): void;
}>();
const inputValue = ref();
const isOpen = ref(false);
const toggleMenu = (val?: boolean) => {
  isOpen.value = val === undefined ? !isOpen.value : val;
  if (isOpen.value) update();
};

const selectEl = ref(null);
onClickOutside(selectEl, () => (isOpen.value = false));
const { top, left, height, width, update } = useElementBounding(selectEl);
const optionsPos = computed(() => {
  const body = document.body.getBoundingClientRect();
  return {
    top: `${top.value - body.top + height.value - 1}px`,
    width: `${width.value}px`,
    left: `${left.value}px`,
  };
});

const optionEls = useTemplateRefsList<HTMLDivElement>();
const optionClasses = (val: string) => {
  return {
    "cc-option--selected": props.modelValue === val,
  };
};
const selectOption = (val: string) => {
  const selected = props.allowEmpty && val === props.modelValue ? undefined : val;
  inputValue.value = selected;
  emit("update:modelValue", selected);
};
</script>

<template>
  <div>
    <div ref="selectEl" class="cc-select" :class="{ 'cc-select--open': isOpen }">
      <input class="cc-select__input" v-model="inputValue" />
      <button class="cc-select__toggle" @click="toggleMenu()">
        <CcIcon name="chevron-down" />
      </button>
    </div>
    <teleport to="body">
      <ul v-if="isOpen" class="cc-option" :style="optionsPos">
        <li
          v-for="option in props.options"
          :key="option"
          :ref="optionEls.set"
          class="cc-option__item"
          :class="optionClasses(option)"
          @click="selectOption(option)"
        >
          {{ option }}
        </li>
      </ul>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.cc-select {
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

  &__item {
    &:hover {
      background-color: color(blue-200);
    }
  }

  &--selected {
    color: #fff;

    background-color: color(blue-400);

    &:hover {
      background-color: color(blue-600);
    }
  }
}
</style>
