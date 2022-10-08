<script setup lang="ts">
import { ref } from "vue";
import CcTab from "./CcTab.vue";

const tabs = ref(["Requested", "Active", "Completed", "Cancelled"]);
const selected = ref("");
</script>

<template>
  <Story title="CcTab" :layout="{ type: 'grid', width: '20vw' }">
    <Variant title="default">
      <CcTab v-model="selected" :tabs="tabs"></CcTab>
      <div>Tab selected: {{ selected }}</div>
    </Variant>
    <Variant title="Button styling">
      <CcTab v-model="selected" :tabs="tabs" buttons></CcTab>
      <div>Tab selected: {{ selected }}</div>
    </Variant>
  </Story>
</template>
