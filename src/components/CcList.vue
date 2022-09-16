<script lang="ts">
import type { VNode } from "vue";
import type { KeysMatching } from "@/types";
import CcListBase from "./CcListBase.vue";

interface ListStringProps {
  modelValue?: string | string[];
  items: string[];
  maxHeight?: number;
  required?: boolean;
  disabled?: boolean;
  disableItem?: (index: number) => boolean;
}

interface ListObjectProps<T> {
  modelValue?: T | T[];
  items: T[];
  itemKey: KeysMatching<T, string | number>;
  maxHeight?: number;
  required?: boolean;
  disabled?: boolean;
  disableItem?: (index: number) => boolean;
}

type Props<T> = T extends string ? ListStringProps : ListObjectProps<T>;

interface Slots<T> {
  default?: (context: { item: T }) => VNode[] | undefined;
  emptyList?: () => VNode[] | undefined;
}

type CcList = new <T = string>(props: Props<T>) => {
  $props: Props<T>;
  $slots: Slots<T>;
  $emit: {
    (e: "update:modelValue", v: T | T[]): void;
    (e: "select", v: T): void;
  };
};

export default CcListBase as CcList;
</script>
