<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { onClickOutside, useActiveElement, useElementBounding, useTimeoutFn } from "@vueuse/core";
import { pluralise } from "@/utils/pluralise";
import type { ListItemType, ListValueType } from "@/types";
import CcIcon from "./CcIcon.vue";
import CcPill from "./CcPill.vue";
import CcList from "./CcListBase.vue";

interface Props {
  modelValue?: ListValueType;
  placeholder?: string;
  options: ListItemType[];
  optionKey?: string;
  label?: string | ((option: Record<string, unknown>) => string);
  required?: boolean;
  searchable?: boolean;
  showTags?: boolean;
  maxHeight?: string;
}
const props = withDefaults(defineProps<Props>(), {
  required: false,
  searchable: false,
  showTags: false,
  maxHeight: "322px",
  placeholder: "Please select an option",
});
const emit = defineEmits<{
  (e: "update:modelValue", v: ListValueType | undefined): void;
}>();

const listValues = ref<ListValueType>();
watch(
  () => props.modelValue,
  (val) => {
    listValues.value = val;
  },
  { immediate: true, deep: true }
);

const isMultiple = computed(() => Array.isArray(props.modelValue));

const inputValue = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const activeElement = useActiveElement();

const filteredOptions = computed(() =>
  props.options.filter((x) => (getLabel(x)?.toLowerCase().indexOf(inputValue.value.toLowerCase()) ?? 0) >= 0)
);

const isOpen = ref(false);
const keepInDom = ref(false);

const { start: removeMenu, stop: cancelRemoval } = useTimeoutFn(
  () => {
    keepInDom.value = false;
  },
  3000,
  { immediate: false }
);

const toggleMenu = (val?: boolean) => {
  if (val === isOpen.value) return;

  isOpen.value = val === undefined ? !isOpen.value : val;
  if (isOpen.value) {
    cancelRemoval();
    keepInDom.value = true;
    update();
    const highlightedOption = Array.isArray(props.modelValue)
      ? props.modelValue[props.modelValue.length - 1]
      : props.modelValue;
    const key = getKey(highlightedOption);
    const index = filteredOptions.value.findIndex((x) => getKey(x) === key);
    nextTick(() => {
      optionEl.value?.highlightItem(index < 0 ? 0 : index);
    });
  } else {
    removeMenu();
  }
  nextTick(() => {
    const el =
      props.searchable && (isOpen.value || !isMultiple.value)
        ? inputRef.value
        : isOpen.value
        ? optionEl.value?.$el
        : selectEl.value;
    el.focus();
  });
};

const selectEl = ref<HTMLElement | null>(null);
onClickOutside(selectEl, () => {
  if (isOpen.value && optionEl.value?.isOutside) {
    setTimeout(() => toggleMenu(false), 5);
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

const optionEl = ref<InstanceType<typeof CcList> | null>(null);

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

const getLabel = (option: ListItemType | undefined) =>
  option === undefined || typeof option === "string" ? option ?? "" : getLabelFn.value(option);
const getKey = (option: ListItemType | undefined) =>
  option === undefined || typeof option === "string"
    ? option
    : props.optionKey
    ? option[props.optionKey]
    : getLabel(option);

const selectHighlighted = () => {
  optionEl.value?.selectHighlighted();
  inputValue.value = "";
  toggleMenu(isMultiple.value);
};

const removeOption = (option: ListItemType) => {
  if (Array.isArray(props.modelValue)) {
    emit(
      "update:modelValue",
      props.modelValue.filter((x) => x !== option)
    );
  }
};
const updateValue = () => {
  emit("update:modelValue", listValues.value);
  toggleMenu(isMultiple.value);
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
              v-if="props.placeholder && props.modelValue.length === 0 && props.required"
              class="cc-select__placeholder"
            >
              {{ props.placeholder }}
            </span>
            <template v-else-if="props.showTags && props.modelValue.length > 0">
              <CcPill
                v-for="option in props.modelValue"
                :key="(getKey(option) as string | number | undefined)"
                size="sm"
                :label="getLabel(option)"
                :close="!props.required || props.modelValue.length > 1"
                @close="removeOption(option)"
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
            v-if="!inputValue"
            class="cc-select__value"
            :class="{ 'cc-select--focused': isOpen && (activeElement === inputRef || isMultiple) }"
          >
            {{ Array.isArray(props.modelValue) ? "Search options" : getLabel(props.modelValue) }}
          </span>
          <input
            class="cc-select__input"
            ref="inputRef"
            v-model="inputValue"
            @click="!isMultiple && toggleMenu()"
            @keydown.up.prevent="optionEl?.highlightPrev()"
            @keydown.down.prevent="optionEl?.highlightNext()"
            @keydown.esc.prevent="toggleMenu(false)"
            @keydown.tab.prevent="toggleMenu(false)"
            @keydown.enter.prevent.stop="isOpen ? selectHighlighted() : toggleMenu(true)"
          />
        </div>
      </div>
      <button class="cc-select__toggle" tabindex="-1" @click="toggleMenu()">
        <CcIcon name="chevron-down" />
      </button>
    </div>
    <teleport to="body">
      <CcList
        v-if="keepInDom"
        v-show="isOpen"
        v-model="listValues"
        ref="optionEl"
        class="cc-select__options"
        :items="filteredOptions"
        :item-key="props.optionKey"
        :style="optionsPos"
        :max-height="props.maxHeight"
        :required="props.required"
        v-slot="{ item }"
        child
        @select="updateValue()"
      >
        {{ getLabel(item) }}
      </CcList>
    </teleport>
  </div>
</template>
