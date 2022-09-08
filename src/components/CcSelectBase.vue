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
  placeholder?: string;
  options: SelectOptionType[];
  optionKey?: string;
  label?: string | ((option: Record<string, unknown>) => string);
  allowEmpty?: boolean;
  searchable?: boolean;
  showTags?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  allowEmpty: false,
  searchable: false,
  showTags: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", v: SelectValueType): void;
}>();

const isMultiple = computed(() => Array.isArray(props.modelValue));
const inputValue = ref();
const isOpen = ref(false);
const toggleMenu = (val?: boolean) => {
  isOpen.value = val === undefined ? !isOpen.value : val;
  if (isOpen.value) {
    update();
  }
};

const selectEl = ref(null);
onClickOutside(selectEl, () => {
  if (!isMultiple.value || isOutside.value) {
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
const highlighted = ref<number>();

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
const getKey = (option: SelectOptionType | undefined) =>
  option === undefined || typeof option === "string"
    ? option
    : props.optionKey
    ? option[props.optionKey]
    : getLabel(option);

const optionClasses = (option: SelectOptionType, index: number) => {
  return {
    "cc-option--selected":
      isMultiple.value && Array.isArray(props.modelValue)
        ? props.modelValue.includes(option)
        : props.modelValue === option,
    "cc-option--highlighted": index === highlighted.value,
  };
};
const selectOption = (option: SelectOptionType) => {
  if (Array.isArray(props.modelValue)) {
    const key = getKey(option);
    const foundItem = key && props.modelValue.find((x) => getKey(x) === key);
    const items = foundItem ? props.modelValue.filter((x) => x !== foundItem) : [...props.modelValue, option];
    if (props.allowEmpty || items.length > 0) {
      emit("update:modelValue", items);
    }
  } else {
    const selected = props.allowEmpty && option === props.modelValue ? undefined : option;
    inputValue.value = getLabel(selected);
    emit("update:modelValue", selected);
  }
};
const highlightOption = (index?: number) => {
  highlighted.value = index;
};
</script>

<template>
  <div>
    <div ref="selectEl" class="cc-select" :class="{ 'cc-select--open': isOpen }">
      <input v-if="props.searchable" class="cc-select__input" v-model="inputValue" @focus="toggleMenu(true)" />
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
            :key="(getKey(option) as string | number | undefined)"
            size="sm"
            :label="getLabel(option)"
            :close="props.allowEmpty || props.modelValue.length > 1"
            @close="selectOption(option)"
          />
        </template>
      </div>
      <button class="cc-select__toggle" @click="toggleMenu()">
        <CcIcon name="chevron-down" />
      </button>
    </div>
    <teleport to="body">
      <ul v-if="isOpen" ref="optionEl" class="cc-option" :style="optionsPos" @mouseleave="highlightOption()">
        <li v-if="props.options.length === 0" class="cc-option__empty">
          <slot name="noOptions"><em>List is empty</em></slot>
        </li>
        <template v-else>
          <li
            v-for="(option, index) in props.options"
            :key="getLabel(option)"
            :ref="optionEls.set"
            class="cc-option__item"
            :class="optionClasses(option, index)"
            @click="selectOption(option)"
            @mouseenter="highlightOption(index)"
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
  }

  &--selected {
    color: #fff;

    background-color: color(blue-400);
  }

  &--highlighted {
    background-color: color(blue-200);

    &.cc-option--selected {
      background-color: color(blue-600);
    }
  }
}
</style>
