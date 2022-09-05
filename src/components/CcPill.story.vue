<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { ColorKind, SizeType } from "@/types";
import { colorNames, colorShades } from "@/utils/prop-types";
import CcPill from "./CcPill.vue";

const state = reactive({
  caption: "Hello",
  size: "" as SizeType,
  border: false,
  close: false,
});

const colorName = ref<string>("red");
const colorShade = ref<string>("500");
const color = ref<ColorKind>("red-500");

const bgColorName = ref<string>("red");
const bgColorShade = ref<string>("50");
const bgColor = ref<ColorKind>("red-50");

watch(
  () => `${colorName.value}-${colorShade.value}`,
  (val) => (color.value = val as ColorKind),
  { immediate: true, deep: true }
);
watch(
  () => `${bgColorName.value}-${bgColorShade.value}`,
  (val) => (bgColor.value = val as ColorKind),
  { immediate: true, deep: true }
);
</script>

<template>
  <Story title="CcPill">
    <CcPill :bg="bgColor" :fg="color" :size="state.size" :border="state.border" :close="state.close">
      {{ state.caption }}
    </CcPill>

    <template #controls>
      <HstText v-model="state.caption" title="Caption" />
      <HstSelect v-model="bgColorName" :options="colorNames" title="Pill Color" />
      <HstSelect v-model="bgColorShade" :options="colorShades" title="Shade" />
      <HstSelect v-model="colorName" :options="colorNames" title="Text Color" />
      <HstSelect v-model="colorShade" :options="colorShades" title="Shade" />
      <HstText v-model="state.size" title="Size" />
      <HstCheckbox v-model="state.border" title="Border" />
      <HstCheckbox v-model="state.close" title="Close button" />
    </template>
  </Story>
</template>
