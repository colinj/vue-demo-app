<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import {
  onClickOutside,
  useActiveElement,
  useElementBounding,
  useMouseInElement,
  useTemplateRefsList,
} from "@vueuse/core";
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
const inputValue = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const activeElement = useActiveElement();

const filteredOptions = computed(() => props.options.filter((x) => (getLabel(x)?.indexOf(inputValue.value) ?? 0) >= 0));

const isClosing = ref(false);
const isOpen = ref(false);
const toggleMenu = (val?: boolean, keepFocusInInput = false) => {
  if (isClosing.value) {
    isClosing.value = false;
    isOpen.value = false;
    return;
  }

  isOpen.value = val === undefined ? !isOpen.value : val;
  if (isOpen.value) {
    update();
    const highlightedOption = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue;
    const key = getKey(highlightedOption);
    const index = props.options.findIndex((x) => getKey(x) === key);
    highlightOption(index < 0 ? 0 : index);
    if (!keepFocusInInput) {
      nextTick(() => {
        optionEl.value?.focus();
      });
    } else {
      inputRef.value?.select();
    }
  } else {
    console.log("from input");
    nextTick(() => {
      if (props.searchable) {
        console.log("FOCUS + SELECT");
        inputRef.value?.focus();
        inputRef.value?.select();
      } else {
        selectEl.value?.focus();
      }
    });
  }
};

const selectEl = ref<HTMLElement | null>(null);
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

const optionEl = ref<HTMLElement | null>(null);
const { isOutside } = useMouseInElement(optionEl);
const optionEls = useTemplateRefsList<HTMLDivElement>();
const highlighted = ref(-1);

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
  option === undefined || typeof option === "string" ? option ?? "" : getLabelFn.value(option);
const getKey = (option: SelectOptionType | undefined) =>
  option === undefined || typeof option === "string"
    ? option
    : props.optionKey
    ? option[props.optionKey]
    : getLabel(option);

const optionClasses = (option: SelectOptionType, index: number) => {
  return {
    "cc-option--selected": Array.isArray(props.modelValue)
      ? props.modelValue.includes(option)
      : props.modelValue === option,
    "cc-option--highlighted": index === highlighted.value,
  };
};
const selectOption = (option: SelectOptionType, closeMenu = false) => {
  if (Array.isArray(props.modelValue)) {
    const key = getKey(option);
    const foundItem = key && props.modelValue.find((x) => getKey(x) === key);
    const items = foundItem ? props.modelValue.filter((x) => x !== foundItem) : [...props.modelValue, option];
    if (props.allowEmpty || items.length > 0) {
      emit("update:modelValue", items);
    }
  } else {
    const selected = props.allowEmpty && option === props.modelValue ? undefined : option;
    // inputValue.value = getLabel(selected);
    emit("update:modelValue", selected);
  }
  if (closeMenu) {
    console.log("CLOSE MENU");
    isClosing.value = true;
    toggleMenu(false);
  }
};

const highlightOption = (index: number) => {
  highlighted.value = index;
};
const highlightNext = () => {
  highlighted.value = highlighted.value < props.options.length - 1 ? highlighted.value + 1 : 0;
};

const highlightPrev = () => {
  highlighted.value = highlighted.value > 0 ? highlighted.value - 1 : props.options.length - 1;
};
</script>

<template>
  <div>
    <div
      ref="selectEl"
      class="cc-select"
      :class="{ 'cc-select--open': isOpen }"
      tabindex="0"
      @keydown.space="!props.searchable && toggleMenu()"
      @keydown.enter="!props.searchable && toggleMenu()"
    >
      <div class="cc-select__container">
        <div class="cc-select__tags" @click="toggleMenu()">
          <template v-if="Array.isArray(props.modelValue)">
            <template v-if="props.showTags">
              <CcPill
                v-for="option in props.modelValue"
                :key="(getKey(option) as string | number | undefined)"
                size="sm"
                :label="getLabel(option)"
                :close="props.allowEmpty || props.modelValue.length > 1"
                @close="selectOption(option)"
              />
            </template>
            <span v-else>
              {{ pluralise(props.modelValue.length, "option") + " selected" }}
            </span>
          </template>
          <template v-else-if="!props.searchable">
            <span v-if="props.placeholder && !props.modelValue" class="cc-select__placeholder">
              {{ props.placeholder }}
            </span>
            <span v-else>
              {{ getLabel(props.modelValue) }}
            </span>
          </template>
        </div>
        <div v-if="props.searchable" class="cc-select__input-container">
          <span
            v-if="!Array.isArray(props.modelValue) && !inputValue"
            class="cc-select__value"
            :class="{ 'cc-select--focused': activeElement === inputRef && isOpen }"
          >
            {{ getLabel(props.modelValue) }}
          </span>
          <input
            class="cc-select__input"
            ref="inputRef"
            v-model="inputValue"
            @focus="toggleMenu(true, true)"
            @keydown.up.prevent="highlightPrev()"
            @keydown.down.prevent="highlightNext()"
            @keydown.enter.prevent="
              isOpen ? selectOption(props.options[highlighted], !isMultiple) : toggleMenu(true, true)
            "
          />
        </div>
      </div>
      <button class="cc-select__toggle" tabindex="-1" @click="toggleMenu()">
        <CcIcon name="chevron-down" />
      </button>
    </div>
    <teleport to="body">
      <ul
        v-if="isOpen"
        ref="optionEl"
        class="cc-option"
        :style="optionsPos"
        tabindex="-1"
        @mouseleave="highlightOption(-1)"
        @keydown.up="highlightPrev()"
        @keydown.down="highlightNext()"
        @keydown.space="selectOption(props.options[highlighted], !isMultiple)"
        @keydown.enter="selectOption(props.options[highlighted], !isMultiple)"
        @keydown.esc="toggleMenu(false)"
        @keydown.tab="toggleMenu(false)"
      >
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
            @click="selectOption(option, !isMultiple)"
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

  &__container {
    display: flex;
    flex-flow: row wrap;

    width: 100%;
  }

  &__placeholder {
    color: color(grey-400);
  }

  &__input-container {
    width: 100%;
  }

  &__input {
    flex-basis: 100%;

    width: 100%;
    padding: 4px 0 4px 8px;

    border: 1px solid transparent;
    border-radius: $border-radius-sm;
  }

  &__value {
    position: absolute;

    display: flex;
    flex-basis: 100%;
    align-items: center;

    min-height: 26px;
    margin: 4px 0 4px 10px;

    color: color(grey-900);

    &.cc-select--focused {
      color: color(grey-400);
    }
  }

  &__tags {
    display: flex;
    flex-basis: 100%;
    flex-flow: row wrap;
    gap: 4px;
    align-items: center;

    width: 100%;
    min-height: 26px;
    margin: 4px 0 4px 10px;

    &:empty {
      display: none;
    }
  }

  &__toggle {
    display: grid;
    place-content: center;
    align-self: stretch;

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
