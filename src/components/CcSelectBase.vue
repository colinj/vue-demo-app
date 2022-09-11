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
  placeholder: "Please select an option",
});
const emit = defineEmits<{
  (e: "update:modelValue", v: SelectValueType): void;
}>();

const isMultiple = computed(() => Array.isArray(props.modelValue));
const inputValue = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const activeElement = useActiveElement();

const filteredOptions = computed(() =>
  props.options.filter((x) => (getLabel(x)?.toLowerCase().indexOf(inputValue.value.toLowerCase()) ?? 0) >= 0)
);

const isOpen = ref(false);
const toggleMenu = (val?: boolean) => {
  isOpen.value = val === undefined ? !isOpen.value : val;
  if (isOpen.value) {
    update();
    const highlightedOption = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue;
    const key = getKey(highlightedOption);
    const index = filteredOptions.value.findIndex((x) => getKey(x) === key);
    highlightOption(index < 0 ? 0 : index);
  }
  nextTick(() => {
    const el =
      props.searchable && (isOpen.value || !isMultiple.value)
        ? inputRef.value
        : isOpen.value
        ? optionEl.value
        : selectEl.value;
    el?.focus();
  });
};

const selectEl = ref<HTMLElement | null>(null);
onClickOutside(selectEl, () => {
  if (isOpen.value && (!isMultiple.value || isOutside.value)) {
    toggleMenu(false);
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
const selectOption = (option: SelectOptionType | undefined) => {
  if (option === undefined) {
    return;
  }
  if (Array.isArray(props.modelValue)) {
    const key = getKey(option);
    const foundItem = key && props.modelValue.find((x) => getKey(x) === key);
    const items = foundItem ? props.modelValue.filter((x) => x !== foundItem) : [...props.modelValue, option];
    if (props.allowEmpty || items.length > 0) {
      emit("update:modelValue", items);
    }
  } else {
    const selected = props.allowEmpty && option === props.modelValue ? undefined : option;
    emit("update:modelValue", selected);
  }
  inputValue.value = "";
  if (!isMultiple.value) {
    toggleMenu(false);
  }
};

const highlightOption = (index: number) => {
  highlighted.value = index;
};
const highlightNext = () => {
  highlighted.value = highlighted.value < filteredOptions.value.length - 1 ? highlighted.value + 1 : 0;
};

const highlightPrev = () => {
  highlighted.value = highlighted.value > 0 ? highlighted.value - 1 : filteredOptions.value.length - 1;
};
</script>

<template>
  <div>
    <div
      ref="selectEl"
      class="cc-select"
      :class="{ 'cc-select--open': isOpen }"
      tabindex="0"
      @keydown.space="(!props.searchable || isMultiple) && toggleMenu()"
      @keydown.enter="(!props.searchable || isMultiple) && toggleMenu()"
    >
      <div class="cc-select__container">
        <div class="cc-select__tags" @click="toggleMenu()">
          <template v-if="Array.isArray(props.modelValue)">
            <span
              v-if="props.placeholder && props.modelValue.length === 0 && !props.allowEmpty"
              class="cc-select__placeholder"
            >
              {{ props.placeholder }}
            </span>
            <template v-else-if="props.showTags">
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
        <div v-if="props.searchable && (!isMultiple || isOpen)" class="cc-select__input-container">
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
            @click="!isMultiple && toggleMenu(!isOpen)"
            @keydown.up.prevent="highlightPrev()"
            @keydown.down.prevent="highlightNext()"
            @keydown.esc.prevent="toggleMenu(false)"
            @keydown.tab.prevent="toggleMenu(false)"
            @keydown.enter.prevent.stop="isOpen ? selectOption(filteredOptions[highlighted]) : toggleMenu(true)"
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
        @keydown.space="selectOption(filteredOptions[highlighted])"
        @keydown.enter="selectOption(filteredOptions[highlighted])"
        @keydown.esc="toggleMenu(false)"
        @keydown.tab="toggleMenu(false)"
      >
        <li v-if="filteredOptions.length === 0" class="cc-option__empty">
          <slot name="noOptions"><em>List is empty</em></slot>
        </li>
        <template v-else>
          <li
            v-for="(option, index) in filteredOptions"
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
