<script lang="ts">
import type { VNode } from "vue";
import type { KeysMatching } from "@/types";
import CcListBase from "./CcListBase.vue";

export interface StringProp {
  modelValue?: string | string[];
  options: string[];
  allowEmpty?: boolean;
}

export interface ObjectProp<T extends Record<string, unknown>> {
  modelValue?: T | T[];
  options: T[];
  allowEmpty?: boolean;
  key: KeysMatching<T, string | number>;
}

type Props<T extends string | Record<string, unknown>> = T extends Record<string, unknown> ? ObjectProp<T> : StringProp;

interface Slots<T> {
  default?: (context: { option: T }) => VNode[] | undefined;
  noOptions?: () => VNode[] | undefined;
}

type CcList = new <T extends string | Record<string, unknown>>(props: Props<T>) => {
  $props: Props<T>;
  $slots: Slots<T>;
};

export default CcListBase as CcList;
</script>
