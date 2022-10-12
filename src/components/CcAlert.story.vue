<script setup lang="ts">
import { reactive } from "vue";
import { logEvent } from "histoire/client";
import CcAlert from "./CcAlert.vue";

const state = reactive({
  isOpen: true,
  dismissable: false,
});
</script>

<template>
  <Story title="CcAlert">
    <Variant title="default">
      <div class="playground">
        <CcAlert v-model="state.isOpen" :dismissible="state.dismissable" @dismiss="logEvent('dismissed', $event)">
          Lorem ipsum dolor sit amet
          <template #content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          </template>
        </CcAlert>
      </div>
    </Variant>

    <template #controls>
      <HstCheckbox v-model="state.isOpen" title="State" />
      <HstCheckbox v-model="state.dismissable" title="Dismissable" />
    </template>
  </Story>
</template>
<style lang="scss" scoped>
.playground {
  padding: 48px;
}
</style>
