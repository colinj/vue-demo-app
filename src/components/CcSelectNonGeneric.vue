<script setup lang="ts">
import { computed, ref } from "vue";
import { onClickOutside, useElementBounding, useMouseInElement, useTemplateRefsList } from "@vueuse/core";
import { pluralise } from "@/utils/pluralise";
import CcIcon from "./CcIcon.vue";
import CcPill from "./CcPill.vue";

type SelectOptionType = string | Record<string, unknown>;

type SelectValueType = SelectOptionType | SelectOptionType[] | undefined;

interface Props {
  modelValue?: SelectValueType;
  options: SelectOptionType[];
  placeholder?: string;
  label?: string | ((option: Record<string, unknown>) => string);
  allowEmpty?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  showTags?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  allowEmpty: false,
  multiple: false,
  searchable: false,
  showTags: false,
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

const getLabel = (option: SelectOptionType | undefined) =>
  option === undefined || typeof option === "string" ? option : getLabelFn.value(option);

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
    inputValue.value = getLabel(selected);
    emit("update:modelValue", selected);
  }
};
</script>

<template>
  <div>
    <div ref="selectEl" class="cc-select" :class="{ 'cc-select--open': isOpen }">
      <input v-if="props.searchable" class="cc-select__input" v-model="inputValue" />
      <div v-else class="cc-select__tags" @click="toggleMenu()">
        <span v-if="props.placeholder && !props.modelValue" class="cc-select__placeholder">
          {{ props.placeholder }}
        </span>
        <span v-if="!Array.isArray(props.modelValue)">
          {{ getLabel(props.modelValue) }}
        </span>
        <span v-else-if="!props.showTags">{{ pluralise(props.modelValue.length, "option") }} selected</span>
        <template v-else>
          <CcPill
            v-for="option in props.modelValue"
            :key="getLabel(option)"
            size="sm"
            :label="getLabel(option)"
            close
            @close="selectOption(option)"
          />
        </template>
      </div>
      <button class="cc-select__toggle" @click="toggleMenu()">
        <CcIcon name="chevron-down" />
      </button>
    </div>
    <teleport to="body">
      <ul v-if="isOpen" ref="optionEl" class="cc-option" :style="optionsPos">
        <li v-if="props.options.length === 0" class="cc-option__empty">
          <slot name="noOptions"><em>List is empty</em></slot>
        </li>
        <template v-else>
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
        </template>
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

  &__placeholder {
    color: color(grey-400);
  }

  &__input {
    width: 100%;
    margin: 4px 0 4px 8px;

    border: 0;
  }

  &__tags {
    display: flex;
    flex-flow: row wrap;
    gap: 4px;
    align-items: center;

    width: 100%;
    min-height: 26px;
    margin: 4px 0 4px 10px;
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

%cc-option-item {
  padding: 0 8px;

  line-height: 2;
}

.cc-option {
  position: absolute;

  padding: 4px 0;

  border: 1px solid black;
  border-radius: 0 0 $border-radius-sm $border-radius-sm;

  background-color: #fff;

  &__empty {
    @extend %cc-option-item;
    color: color(grey-400);

    cursor: default;
  }

  &__item {
    @extend %cc-option-item;

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
