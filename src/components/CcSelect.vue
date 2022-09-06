<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { onClickOutside, useElementBounding, useMouseInElement, useTemplateRefsList } from "@vueuse/core";
import CcIcon from "./CcIcon.vue";

type SelectOptionType = string | Record<string, unknown>;

type SelectValueType = SelectOptionType | SelectOptionType[] | undefined;

interface Props {
  modelValue?: SelectValueType;
  options: SelectOptionType[];
  allowEmpty?: boolean;
  multiple?: boolean;
  label?: string | ((option: Record<string, unknown>) => string);
}
const props = withDefaults(defineProps<Props>(), {
  allowEmpty: false,
  multiple: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", v: SelectValueType): void;
}>();

const inputValue = ref();
const isOpen = ref(false);
const toggleMenu = (val?: boolean) => {
  isOpen.value = val === undefined ? !isOpen.value : val;
  if (isOpen.value) update();
};

const selectEl = ref(null);
onClickOutside(selectEl, () => {
  if (!props.multiple || isOutside.value) {
    isOpen.value = false;
  }
});
const { top, left, height, width, update } = useElementBounding(selectEl);
const optionsPos = computed(() => {
  const body = document.body.getBoundingClientRect();
  return {
    top: `${top.value - body.top + height.value - 1}px`,
    width: `${width.value}px`,
    left: `${left.value}px`,
  };
});

const optionEl = ref(null);
const { isOutside } = useMouseInElement(optionEl);
const optionEls = useTemplateRefsList<HTMLDivElement>();

const getLabelFn = computed(() => {
  if (props.label !== undefined) {
    if (typeof props.label === "function") {
      return props.label;
    } else {
      const key = props.label;
      return (option: Record<string, unknown>) => option[key] as string;
    }
  }
  return () => "label property undefined for options object array";
});

const getLabel = (option: SelectOptionType) => {
  return typeof option === "string" ? option : getLabelFn.value(option);
};

const optionClasses = (option: SelectOptionType) => {
  return {
    "cc-option--selected":
      props.multiple && Array.isArray(props.modelValue)
        ? props.modelValue.includes(option)
        : props.modelValue === option,
  };
};
const selectOption = (option: SelectOptionType) => {
  if (props.multiple) {
    const model =
      props.modelValue === undefined ? [] : Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
    const items = model.includes(option) ? model.filter((x) => x !== option) : [...model, option];
    if (props.allowEmpty || items.length > 0) {
      emit("update:modelValue", items);
    }
  } else {
    const selected = props.allowEmpty && option === props.modelValue ? undefined : option;
    inputValue.value = selected;
    emit("update:modelValue", selected);
  }
};

// if 'multiple' prop is changed, the the modelValue must be reset to undefined,
// because the current value would be invalid since it can only be an array or a single value.
watch(
  () => props.multiple,
  () => emit("update:modelValue", undefined)
);
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
      <ul v-if="isOpen" ref="optionEl" class="cc-option" :style="optionsPos">
        <li
          v-for="option in props.options"
          :key="getLabel(option)"
          :ref="optionEls.set"
          class="cc-option__item"
          :class="optionClasses(option)"
          @click="selectOption(option)"
        >
          {{ getLabel(option) }}
        </li>
      </ul>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.cc-select {
  display: flex;
  align-items: center;

  border: 1px solid black;
  border-radius: $border-radius-sm;

  &__input {
    width: 100%;
    margin: 4px 0 4px 8px;

    border: 0;
  }

  &__toggle {
    display: grid;
    place-content: center;

    padding: 8px;

    border: 0;

    background-color: transparent;

    svg {
      transition: transform 0.2s ease;
    }
  }

  &--open {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;

    .cc-select__toggle svg {
      transform: rotate(180deg);
    }
  }
}

.cc-option {
  position: absolute;

  padding: 4px 8px;

  border: 1px solid black;
  border-radius: 0 0 $border-radius-sm $border-radius-sm;

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
