import type { InjectionKey, Ref } from "vue";
import type { FieldProps } from "@/types";

export const FieldKey: InjectionKey<FieldProps> = Symbol("FieldProps");
export const InvalidFormKey: InjectionKey<Ref<boolean>> = Symbol("InvalidForm");
