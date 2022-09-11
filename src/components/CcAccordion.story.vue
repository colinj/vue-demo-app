<script setup lang="ts">
import { ref } from "vue";
import CcAccordion from "./CcAccordion.vue";
import CcSelect from "./CcSelect.vue";

const open = ref(false);
</script>

<template>
  <Story title="CcAccordion" :layout="{ type: 'grid', width: '100%' }">
    <Variant title="default">
      <div class="story-container">
        <div class="mb-4">Accordion open: {{ open }}</div>
        <CcAccordion v-model="open">
          <template #header>This is the header</template>
          <template #content>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a elit ante. Suspendisse potenti. Nullam
              non lacinia odio. Phasellus pretium pharetra nibh at cursus. Sed placerat, erat nec vestibulum interdum,
              nibh mi dignissim erat, quis euismod justo sapien vel enim. Sed tempor dui sit amet cursus semper. Aenean
              commodo lacus ultrices orci tincidunt commodo. Cras varius auctor tortor vel blandit. Aliquam sed turpis
              ac velit vestibulum ultrices id eget massa. Nullam rhoncus vulputate arcu, non elementum leo tristique id.
              Pellentesque cursus, nulla aliquam fermentum iaculis, mi ligula aliquet eros, eget maximus odio metus et
              nisl. Phasellus nisl enim, auctor sed orci nec, condimentum porta orci. Curabitur nec hendrerit enim.
              Vivamus nec diam nulla. Mauris mauris lacus, rhoncus eu pharetra elementum, dictum sed quam. Proin varius
              scelerisque efficitur.
            </p>
            <CcSelect :options="['tom', 'jake', 'mary', 'linda', 'pamela', 'peter']" />
          </template>
        </CcAccordion>
      </div>
    </Variant>
  </Story>
</template>

<style lang="scss" scoped>
.story-container {
  height: 400px;
}
</style>
