<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { TabProps } from "@/types";
import { useTemplateRefsList } from "@vueuse/core";
import CcIcon from "./CcIcon.vue";

type TabItem = TabProps | string;

interface Props {
  tabs: TabItem[];
  modelValue: string | undefined;
  buttons?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
});
const emit = defineEmits(["update:modelValue"]);

const tabItems = computed(() => props.tabs.map((tab) => (typeof tab === "string" ? { id: tab, caption: tab } : tab)));
const tabRefs = useTemplateRefsList<HTMLButtonElement>();
const sliderStyle = ref();
const setSelected = (id: string | undefined) => {
  const index = tabItems.value.findIndex((t) => t.id == id);
  if (index >= 0) {
    const first = tabRefs.value[0].getBoundingClientRect();
    const rect = tabRefs.value[index].getBoundingClientRect();
    sliderStyle.value = { left: `${rect.x - first.x}px`, width: `${rect.width}px` };
    emit("update:modelValue", tabItems.value[index].id);
  }
};
const gotoTab = (index: number) => {
  const tabIndex = index < 0 ? tabRefs.value.length - 1 : index === tabRefs.value.length ? 0 : index;
  tabRefs.value[tabIndex].focus();
};

watch(
  () => props.modelValue,
  (id) => setSelected(id)
);
watch(tabItems, () => setSelected(props.modelValue), { immediate: true, deep: true, flush: "post" });
</script>

<template>
  <div class="cc-tab" :class="{ 'cc-tab--buttons': props.buttons }">
    <button
      v-for="(tab, index) in tabItems"
      :key="tab.id"
      :ref="tabRefs.set"
      class="cc-tab__item"
      :class="{ 'cc-tab--selected': tab.id === props.modelValue }"
      @click="tab.id !== props.modelValue && setSelected(tab.id)"
      @keydown.left="gotoTab(index - 1)"
      @keydown.right="gotoTab(index + 1)"
    >
      <slot :tab="tab">
        <CcIcon v-if="tab.icon" :name="tab.icon" />
        {{ tab.caption }}
      </slot>
    </button>
    <div class="cc-tab__slider" :style="sliderStyle" />
  </div>
</template>
