import type { iconNames } from "@/utils/icon-names";
import type { colorNames, colorShades } from "@/utils/colors";

export type IconKind = typeof iconNames[number];

export type ColorName = typeof colorNames[number];
export type ColorShade = typeof colorShades[number];
export type ColorKind = `${ColorName}-${ColorShade}`;
