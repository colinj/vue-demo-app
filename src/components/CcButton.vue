<script setup lang="ts">
import { computed } from "vue";
import type { ButtonKind, IconKind } from "@/types";
import type { RouteLocationRaw } from "vue-router";
import CcIcon from "./CcIcon.vue";

interface Props {
  kind?: ButtonKind;
  label?: string;
  icon?: IconKind;
  iconRight?: IconKind;
  to?: RouteLocationRaw;
  href?: string;
  disabled?: boolean;
  type?: string;
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  label: "",
  kind: undefined,
  icon: undefined,
  iconRight: undefined,
  to: undefined,
  href: undefined,
  disabled: false,
  type: "button",
  loading: false,
});

const tag = computed(() => (props.to ? "router-link" : props.href ? "a" : "button"));
const linkProp = computed(() => (props.to ? "to" : "href"));
const linkValue = computed(() => (props.to ? props.to : props.href));
const variation = computed(() => (props.kind ? `cc-btn--${props.kind}` : null));
const buttonType = computed(() => (tag.value === "button" ? props.type : null));
const disabled = computed(() => (props.disabled || props.loading ? true : null));
const tabIndex = computed(() =>
  tag.value !== "button" && props.disabled ? "-1" : tag.value === "router-link" ? "0" : null
);
</script>

<template>
  <component
    :is="tag"
    class="cc-btn"
    :class="[variation, { 'cc-btn--nolabel': !props.label && !$slots.default, 'cc-btn--loading': props.loading }]"
    :type="buttonType"
    :[linkProp]="linkValue"
    :tabindex="tabIndex"
    :disabled="disabled"
  >
    <div v-if="loading" class="spinner"></div>
    <div class="cc-btn__caption">
      <CcIcon v-if="icon" class="cc-btn__icon" size="1em" :name="icon" />
      <slot>
        {{ props.label }}
      </slot>
      <CcIcon v-if="iconRight" class="cc-btn__icon-right" size="1em" :name="iconRight" />
    </div>
  </component>
</template>
