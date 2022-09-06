<script lang="ts">
import CcSelectNonGeneric from "./CcSelectNonGeneric.vue";

type SelectOptionType<T extends Record<string, unknown>> = string | T;

type SelectValueType<T extends Record<string, unknown>> = SelectOptionType<T> | SelectOptionType<T>[] | undefined;

interface Props<T extends Record<string, unknown>> {
  modelValue?: SelectValueType<T>;
  options: SelectOptionType<T>[];
  allowEmpty?: boolean;
  multiple?: boolean;
  label?: string | ((option: T) => string);
}

type CcSelect = new <T extends Record<string, unknown>>(props: Props<T>) => {
  $props: Props<T>;
};

export default CcSelectNonGeneric as CcSelect;
</script>
