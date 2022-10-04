import type { Ref } from "vue";
import type { colorNames, colorShades, buttonKind, sizeType } from "@/utils/prop-types";
import type { iconKind, iconNames } from "@/utils/icon-names";
import type { RouteLocationRaw } from "vue-router";

export type ButtonKind = typeof buttonKind[number];

export type ColorName = typeof colorNames[number];
export type ColorShade = typeof colorShades[number];
export type ColorKind = `${ColorName}-${ColorShade}`;

export type IconKind = typeof iconKind[number];
export type IconName = typeof iconNames[number];

export type SizeType = typeof sizeType[number];

export interface FieldProps {
  fieldId?: Ref<string>;
  hasError?: Ref<boolean>;
  readonly?: Ref<boolean>;
}

export interface MenuOption {
  id: number | string;
  title: string;
  description?: string;
  icon?: IconName;
  disabled?: boolean;
  to?: RouteLocationRaw;
  permission?: string;
}

export interface TabProps<T = unknown> {
  id: string;
  caption: string;
  icon?: IconName;
  data?: T;
}

export type ListItemType = string | Record<string, unknown>;
export type ListValueType = ListItemType | ListItemType[];
