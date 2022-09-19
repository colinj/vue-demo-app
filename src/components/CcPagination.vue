<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CcIcon from "./CcIcon.vue";
import CcDropdown from "./CcDropdown.vue";

interface Props {
  modelValue: number;
  totalItems: number;
  pageSize: number;
  pageSizes?: number[];
  hidePageSize?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 40, 50],
  hidePageSize: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "update:pageSize", value: number): void;
}>();

const totalItems = computed(() => Math.max(props.totalItems, 0));
const pageSize = computed(() => Math.max(props.pageSize, 1));
const pageSizes = computed(() => {
  const sizes = new Set([...props.pageSizes, pageSize]);
  return Array.from(sizes).sort();
});

const getRange = (min: number, max: number) => [...Array(max - min + 1).keys()].map((i) => min + i);

const totalPages = computed(() => Math.max(Math.ceil(totalItems.value / pageSize.value), 1));
const range = computed(() => {
  return totalPages.value < 5
    ? { min: 1, max: totalPages.value }
    : props.modelValue < 4
    ? { min: 1, max: 5 }
    : props.modelValue > totalPages.value - 3
    ? { min: totalPages.value - 4, max: totalPages.value }
    : { min: props.modelValue - 2, max: props.modelValue + 2 };
});
const firstItem = computed(() => (props.modelValue - 1) * pageSize.value + 1);
const lastItem = computed(() => Math.min(props.modelValue * pageSize.value, totalItems.value));
const isActive = (val: number) => (val === props.modelValue ? "cc-pagination--active" : null);
const setPage = (val: number) => emit("update:modelValue", val);

const pageSizeModel = ref(pageSize.value);
watch(pageSizeModel, (val, oldVal) => {
  const oldFirst = (props.modelValue - 1) * oldVal + 1;
  emit("update:modelValue", Math.ceil(oldFirst / val));
  if (val !== pageSize.value) emit("update:pageSize", val);
});

watch(pageSize, (val) => {
  if (val !== pageSizeModel.value) {
    pageSizeModel.value = val;
  }
});
watch(totalItems, (val) => {
  if (firstItem.value > val) {
    setPage(totalPages.value);
  }
});
</script>

<template>
  <div v-if="totalItems > 0" class="cc-pagination">
    <div data-test-id="show-total-items" class="cc-pagination__description">
      <span v-if="hidePageSize">
        showing {{ firstItem }} to {{ lastItem }} of {{ totalItems }} result{{ totalItems === 1 ? "" : "s" }}
      </span>
      <CcDropdown v-else v-model="pageSizeModel" :options="pageSizes">
        <span>
          showing {{ firstItem }} to {{ lastItem }} of {{ totalItems }} result{{ totalItems === 1 ? "" : "s" }}
        </span>
      </CcDropdown>
    </div>
    <div class="cc-pagination__control">
      <div data-test-id="arrow-previous-page" class="cc-pagination__part">
        <button class="cc-pagination__item" :disabled="props.modelValue === 1" @click="setPage(props.modelValue - 1)">
          <CcIcon name="chevron-left" />
        </button>
        <button v-if="range.min > 1" class="cc-pagination__item" @click="setPage(1)">1</button>
      </div>
      <div v-if="range.min > 2" class="cc-pagination__sep">&hellip;</div>
      <div data-test-id="pagination-numbers" class="cc-pagination__part">
        <button
          v-for="num in getRange(range.min, range.max)"
          :key="num"
          class="cc-pagination__item"
          :class="isActive(num)"
          @click="setPage(num)"
        >
          {{ num }}
        </button>
      </div>
      <div v-if="range.max < totalPages - 1" class="cc-pagination__sep">&hellip;</div>
      <div data-test-id="arro`w-`next-page" class="cc-pagination__part">
        <button v-if="range.max < totalPages" class="cc-pagination__item" @click="setPage(totalPages)">
          {{ totalPages }}
        </button>
        <button
          class="cc-pagination__item"
          :disabled="props.modelValue === totalPages"
          @click="setPage(props.modelValue + 1)"
        >
          <CcIcon name="chevron-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cc-pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &__control {
    display: inline-flex;
    justify-content: flex-end;

    width: 380px;
  }

  &__part {
    display: flex;

    & + & {
      margin-left: 16px;
    }
  }

  &__sep {
    flex-grow: 1;

    text-align: center;
  }

  &__item {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    width: 24px;
    height: 24px;
    padding: 0;

    border: 0;
    border-radius: 50%;

    background-color: transparent;

    &:hover:not(.cc-pagination--active, :disabled) {
      background-color: color(grey-100);
    }

    /* stylelint-disable-next-line no-descending-specificity */
    & + & {
      margin-left: 16px;
    }
  }

  &--active {
    background-color: color(grey-200);
  }

  @media (max-width: 640px) {
    justify-content: center;

    &__control {
      justify-content: center;

      margin-top: 24px;
    }
  }
}
</style>
