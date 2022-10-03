import { computed, provide, reactive, readonly, ref } from "vue";
import type { WritableComputedRef } from "vue";
import type { z, ZodEffects, ZodType } from "zod";
import { refAutoReset } from "@vueuse/core";
import { InvalidFormKey } from "@/utils/provider-keys";

export type Field<Value> = {
  name: string;
  error: string;
  value: WritableComputedRef<Value>;
  onBlur(): void;
  touch(): void;
};

export function useZodSchema<
  Schema extends ZodType | ZodEffects<ZodType>,
  Values extends z.infer<Schema>,
  FieldNames extends keyof Values
>(schema: Schema, options?: { initialValues?: Partial<Values> }) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - expression too complex for TypeScript to resolve.
  const keys: FieldNames[] = "shape" in schema ? Object.keys(schema.shape) : Object.keys(schema._def.schema.shape);

  const initialValues: Partial<Values> = options?.initialValues ?? {};
  const values = ref<Partial<Values>>(Object.assign({}, initialValues));
  const readonlyValues = readonly(values);

  type FieldMeta = { [K in FieldNames]?: boolean };
  const touched = ref<FieldMeta>({});
  const dirty = ref<FieldMeta>({});

  const createField = <Value extends Values[FieldNames]>(fieldId: FieldNames) =>
    computed<Value>({
      get() {
        return values.value[fieldId];
      },
      set(newValue) {
        values.value[fieldId] = newValue;
        touched.value[fieldId] = true;
        dirty.value[fieldId] = newValue !== initialValues[fieldId];
        validate();
      },
    });

  type FieldRefs = { [K in FieldNames]: WritableComputedRef<Values[K]> };
  const fields: FieldRefs = Object.fromEntries(
    keys.map((key) => [key, createField<Values[FieldNames]>(key)])
  ) as FieldRefs;

  const useField = <FieldId extends FieldNames, Value extends Values[FieldId]>(fieldId: FieldId) => {
    const value = computed<Value>({
      get() {
        return values.value[fieldId];
      },
      set(newValue) {
        values.value[fieldId] = newValue;
        touched.value[fieldId] = true;
        dirty.value[fieldId] = newValue !== initialValues[fieldId];
        validate();
      },
    });

    return reactive({
      get name() {
        return fieldId;
      },
      get error(): string | undefined {
        return errors.value[fieldId];
      },
      value,

      onBlur: () => {
        touched.value[fieldId] = true;
        validate();
      },

      touch() {
        touched.value[fieldId] = true;
      },
    });
  };

  type Errors = { [x in FieldNames]?: string };

  const errors = ref<Errors>({});
  const submitted = ref(false);
  const isSubmitting = ref(false);

  const validate = (): boolean => {
    const result = schema.safeParse(values.value);
    if (result.success === false) {
      const fieldErrors = result.error.flatten().fieldErrors;
      errors.value = Object.keys(fieldErrors).reduce<Errors>((acc, cur) => {
        const key = cur as FieldNames;
        if (submitted.value || touched.value[key]) {
          const errs = fieldErrors[cur] ?? [];
          if (errs.length > 0) acc[key] = errs[0];
        }
        return acc;
      }, {});
    } else {
      errors.value = {};
    }
    return result.success;
  };

  let submitCount = 0;
  const isInvalidForm = refAutoReset(false, 600);
  provide(InvalidFormKey, isInvalidForm);

  const handleSubmit = (onSubmit: (values: Values) => void) => {
    return async (event: Event) => {
      event.preventDefault();
      submitted.value = true;
      const isValid = validate();
      if (isValid) {
        isSubmitting.value = true;
        try {
          await Promise.resolve(onSubmit(values.value));
        } finally {
          isSubmitting.value = false;
          submitCount = 0;
        }
      } else {
        if (submitCount > 0) isInvalidForm.value = true;
        submitCount++;
      }
    };
  };

  return {
    fields: reactive(fields),
    values: readonlyValues,
    errors,
    dirty,
    touched,
    isSubmitting,
    isInvalidForm,
    useField,
    handleSubmit,
  };
}
