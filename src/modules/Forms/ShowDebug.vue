<script setup lang="ts">
interface Props {
  form: {
    dirty: object;
    values: object;
    errors: object;
  };
}

defineProps<Props>();
</script>

<template>
  <div>
    <section>
      <h3>State</h3>
      <code>
        <pre>{{ JSON.stringify(form.values, null, 2) }}</pre>
      </code>
    </section>

    <section>
      <h3>Errors</h3>
      <code>
        <pre>{{ JSON.stringify(form.errors, null, 2) }}</pre>
      </code>
    </section>

    <section>
      <h3>Dirty</h3>
      <code>
        <pre>{{ JSON.stringify(form.dirty, null, 2) }}</pre>
      </code>
    </section>
  </div>
</template>

<style lang="scss" scoped>
h3 {
  margin: 0;
}

section {
  margin-bottom: 20px;
}

pre {
  width: 100%;
  padding: 20px;

  border-radius: $border-radius-lg;

  background-color: color(grey-100);
}
</style>
