<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { uniqueId } from "@/utils/unique-id";

type RadioOptions = Array<string> | Record<string, string>;

interface Props {
  modelValue: string | undefined;
  options: RadioOptions;
  inline?: boolean;
  outline?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  outline: false,
  disabled: false,
});
const emit = defineEmits<{
  (e: "update:modelValue", v: string | undefined): void;
}>();

const id = uniqueId("radio");
const selected = ref<string>();
const radioOptions = computed<[string, string][]>(() =>
  Array.isArray(props.options) ? props.options.map((s) => [s, s]) : Object.entries(props.options)
);

watch(selected, (val) => emit("update:modelValue", val), { immediate: true });
</script>

<template>
  <div :class="{ 'cc-radio--disabled': props.disabled }">
    <div
      v-for="(option, idx) in radioOptions"
      :key="option[0]"
      class="cc-radio"
      :class="{ 'cc-radio--inline': inline }"
    >
      <input
        :id="`${id}--${idx}`"
        v-model="selected"
        type="radio"
        :name="id"
        :value="option[0]"
        :checked="props.modelValue === option[0]"
        :disabled="props.disabled"
      />
      <label :for="`${id}--${idx}`" class="cc-radio__label" :class="{ 'cc-radio--outline': outline }">
        <slot :option="option">{{ option[1] }}</slot>
      </label>
    </div>
  </div>
</template>
