import type { Ref } from "vue";
import type { buttonKind } from "@/utils/button-kind";
import type { colorNames, colorShades } from "@/utils/colors";
import type { iconNames } from "@/utils/icon-names";

export type ButtonKind = typeof buttonKind[number];

export type ColorName = typeof colorNames[number];
export type ColorShade = typeof colorShades[number];
export type ColorKind = `${ColorName}-${ColorShade}`;

export type IconKind = typeof iconNames[number];

export interface FieldProps {
  fieldId?: Ref<string>;
  hasError?: Ref<boolean>;
  readonly?: Ref<boolean>;
}
