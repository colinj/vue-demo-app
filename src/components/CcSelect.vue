<script lang="ts">
import type { KeysMatching } from "@/types";
import CcSelectBase from "./CcSelectBase.vue";

interface SelectProps {
  placeholder?: string;
  required?: boolean;
  searchable?: boolean;
  showTags?: boolean;
  maxHeight?: number;
  anchor?: Element | null;
}

interface SelectStringProps extends SelectProps {
  modelValue?: string | string[];
  options: string[];
  label?: (option: string) => string;
}

interface SelectObjectProps<T> extends SelectProps {
  modelValue?: T | T[];
  options: T[];
  optionKey: KeysMatching<T, string | number>;
  label?: KeysMatching<T, string> | ((option: T) => string);
}

type Props<T> = T extends string ? SelectStringProps : SelectObjectProps<T>;

type CcSelect = new <T = string>(props: Props<T>) => {
  $props: Props<T>;
  $emit: {
    (e: "update:modelValue", v: T | T[]): void;
  };
};

export default CcSelectBase as CcSelect;
</script>
