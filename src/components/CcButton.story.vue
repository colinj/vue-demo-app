<script setup lang="ts">
import { reactive, ref } from "vue";
import { buttonKind } from "@/utils/prop-types";
import CcButton from "./CcButton.vue";
import type { ButtonKind, IconKind } from "@/types";

const state = reactive({
  label: "Click me",
  icon: "" as IconKind,
  iconRight: "" as IconKind,
  disabled: false,
  loading: false,
});

const kind = ref<ButtonKind>("" as ButtonKind);
</script>

<template>
  <Story title="CcButton" :layout="{ type: 'grid', width: '100%' }">
    <Variant title="Default">
      <CcButton
        :kind="kind"
        :icon="state.icon"
        :icon-right="state.iconRight"
        :disabled="state.disabled"
        :loading="state.loading"
      >
        {{ state.label }}
      </CcButton>
    </Variant>
    <template v-for="kind in buttonKind" :key="kind">
      <Variant :title="kind">
        <CcButton :kind="kind">{{ state.label }}</CcButton>
      </Variant>
    </template>

    <Variant title="Left icon only">
      <CcButton kind="primary" icon="house"></CcButton>
    </Variant>
    <Variant title="Right icon only">
      <CcButton kind="primary" icon-right="arrow-right"></CcButton>
    </Variant>
    <Variant title="Both icons only">
      <CcButton kind="primary" icon="house" icon-right="arrow-right"></CcButton>
    </Variant>
    <Variant title="Left Icon">
      <CcButton kind="primary" icon="house">Click me</CcButton>
    </Variant>
    <Variant title="Right Icon">
      <CcButton kind="primary" icon-right="arrow-right">Click me</CcButton>
    </Variant>
    <Variant title="Both icons ">
      <CcButton kind="primary" icon="house" icon-right="arrow-right">Click me</CcButton>
    </Variant>

    <template #controls>
      <HstText v-model="state.label" title="Label" />
      <HstSelect v-model="kind" :options="['default', ...buttonKind]" title="Kind" />
      <HstText v-model="state.icon" title="Icon" />
      <HstText v-model="state.iconRight" title="Right Icon" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
      <HstCheckbox v-model="state.loading" title="Loading" />
    </template>
  </Story>
</template>
