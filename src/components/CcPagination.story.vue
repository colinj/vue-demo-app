<script setup lang="ts">
import { reactive } from "vue";
import CcPagination from "./CcPagination.vue";

const state = reactive({
  page: 1,
  pageSize: 10,
  totalItems: 35,
});
</script>

<template>
  <Story title="CcPagination">
    <Variant title="default">
      <CcPagination
        v-model="state.page"
        v-model:page-size="state.pageSize"
        :total-items="state.totalItems"
      ></CcPagination>
    </Variant>

    <template #controls>
      <HstNumber v-model="state.page" title="Page" />
      <HstNumber v-model="state.pageSize" title="Page size" />
      <HstNumber v-model="state.totalItems" title="Total items" />
    </template>
  </Story>
</template>
