import type { Ref } from "vue";
import type { colorNames, colorShades, buttonKind, sizeType } from "@/utils/prop-types";
import type { iconNames } from "@/utils/icon-names";

export type ButtonKind = typeof buttonKind[number];

export type ColorName = typeof colorNames[number];
export type ColorShade = typeof colorShades[number];
export type ColorKind = `${ColorName}-${ColorShade}`;

export type IconKind = typeof iconNames[number];

export type SizeType = typeof sizeType[number];

export interface FieldProps {
  fieldId?: Ref<string>;
  hasError?: Ref<boolean>;
  readonly?: Ref<boolean>;
}

export interface TabProps<T = unknown> {
  id: string;
  caption: string;
  icon?: IconKind;
  data?: T;
}
