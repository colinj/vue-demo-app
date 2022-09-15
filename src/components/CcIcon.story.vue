<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { ColorKind, IconKind, IconName } from "@/types";
import { colorNames, colorShades } from "@/utils/prop-types";
import { iconKind } from "@/utils/icon-names";
import CcIcon from "./CcIcon.vue";

const state = reactive({
  name: "house" as IconName,
  kind: "solid" as IconKind,
  size: "5em",
});

const colorName = ref<string>("red");
const colorShade = ref<string>("500");
const color = ref<ColorKind>("red-500");
watch(
  () => `${colorName.value}-${colorShade.value}`,
  (val) => (color.value = val as ColorKind),
  { immediate: true, deep: true }
);
</script>

<template>
  <Story title="CcIcon">
    <Variant title="default">
      <CcIcon :name="state.name" :color="color" :size="state.size" :kind="state.kind"></CcIcon>
    </Variant>

    <template #controls>
      <HstText v-model="state.name" title="Icon" />
      <HstSelect v-model="state.kind" :options="iconKind" title="Icon style" />
      <HstSelect v-model="colorName" :options="colorNames" title="Color" />
      <HstSelect v-model="colorShade" :options="colorShades" title="Shade" />
      <HstText v-model="state.size" title="Size" />
    </template>
  </Story>
</template>
