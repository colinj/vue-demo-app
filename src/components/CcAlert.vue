<script setup lang="ts">
import { ref, watch } from "vue";
import CcButton from "./CcButton.vue";
import CcIcon from "./CcIcon.vue";

interface Props {
  modelValue?: boolean | number | string;
  dismissible?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  dismissible: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean | number | string): void;
  (e: "dismiss"): void;
}>();

const dismissed = ref(false);

const dismiss = () => {
  emit("dismiss");
  dismissed.value = true;
  const retval = typeof props.modelValue === "string" ? "" : typeof props.modelValue === "number" ? 0 : false;
  emit("update:modelValue", retval);
};

watch(
  () => props.modelValue,
  (isOpen) => {
    dismissed.value = !isOpen;
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="!dismissed && props.modelValue" class="cc-alert" role="alert">
    <div class="cc-alert__icon"><CcIcon name="circle-info" role="presentation" /></div>
    <div v-if="$slots.default" class="cc-alert__title"><slot /></div>
    <div v-if="$slots.content" class="cc-alert__body"><slot name="content" /></div>
    <div v-if="props.dismissible" class="cc-alert__close">
      <CcButton kind="link" icon="xmark" @click="dismiss()" />
    </div>
  </div>
</template>
