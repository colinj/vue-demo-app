<script lang="ts">
import type { VNode } from "vue";
import type { KeysMatching } from "@/types";
import CcListBase from "./CcListBase.vue";

export interface StringProp {
  modelValue?: string | string[];
  options: string[];
  maxHeight?: string;
  required?: boolean;
  disabled?: boolean;
  disableItem?: (index: number) => boolean;
}

export interface ObjectProp<T> {
  modelValue?: T | T[];
  options: T[];
  optionKey: KeysMatching<T, string | number>;
  maxHeight?: string;
  required?: boolean;
  disabled?: boolean;
  disableItem?: (index: number) => boolean;
}

type Props<T extends string | Record<string, unknown>> = T extends string ? StringProp : ObjectProp<T>;

interface Slots<T> {
  default?: (context: { option: T }) => VNode[] | undefined;
  noOptions?: () => VNode[] | undefined;
}

type CcList = new <T extends string | Record<string, unknown>>(props: Props<T>) => {
  $props: Props<T>;
  $slots: Slots<T>;
  $emit: {
    (e: "update:modelValue", v: T | T[]): void;
    (e: "select", v: T): void;
  };
};

export default CcListBase as CcList;
</script>
