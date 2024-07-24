import { ColorSchemeName } from "react-native";
import { Colors, getColors } from "./colors";
import { Fonts, getFonts } from "./fonts";
import { Sizes, getSizes } from "./sizes";

export type Theme = {
  fonts: Fonts;
  colors: Colors;
  sizes: Sizes;
};

export const getTheme = (
  baseFontSize: number,
  themeColor?: ColorSchemeName
) => ({
  fonts: getFonts(baseFontSize),
  colors: getColors(themeColor),
  sizes: getSizes(baseFontSize),
});
