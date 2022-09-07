<script lang="ts">
import CcSelectBase from "./CcSelectBase.vue";

type SelectOptionType<T extends Record<string, unknown>> = string | T;

type SelectValueType<T extends Record<string, unknown>> = SelectOptionType<T> | SelectOptionType<T>[] | undefined;

interface Props<T extends Record<string, unknown>> {
  modelValue?: SelectValueType<T>;
  options: SelectOptionType<T>[];
  placeholder?: string;
  label?: string | ((option: T) => string);
  allowEmpty?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  showTags?: boolean;
}

type CcSelect = new <T extends Record<string, unknown>>(props: Props<T>) => {
  $props: Props<T>;
};

export default CcSelectBase as CcSelect;
</script>
