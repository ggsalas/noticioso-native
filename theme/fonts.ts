export type Fonts = {
  baseFontSize: number;

  fontFamilyRegular: string;
  fontFamilyBold: string;
  fontFamilyItalic: string;
  fontFamilyBoldItalic: string;

  fontFamilyCodeRegular: string;
  fontFamilyCodeBold: string;
  fontFamilyCodeItalic: string;
  fontFamilyCodeBoldItalic: string;

  fontSizeH1: number;
  fontSizeH2: number;
  fontSizeH3: number;
  fontSizeH4: number;
  fontSizeH5: number;
  fontSizeP: number;
  fontSizeCode: number;

  lineHeightMinimal: number;
  lineHeightSmall: number;
  lineHeightComfortable: number;
  lineHeightCode: number;
  marginH1: number;
  marginH2: number;
  marginH3: number;
  marginH4: number;
  marginH5: number;
  marginP: number;
};

export function getFonts(baseFontSize: number): Fonts {
  return {
    baseFontSize,

    fontFamilyRegular: "Alegreya_400Regular",
    fontFamilyBold: "Alegreya_700Bold",
    fontFamilyItalic: "Alegreya_400Regular_Italic",
    fontFamilyBoldItalic: "Alegreya_700Bold_Italic",

    fontFamilyCodeRegular: "JetBrainsMono_400Regular",
    fontFamilyCodeBold: "JetBrainsMono_400Regular_Italic",
    fontFamilyCodeItalic: "JetBrainsMono_700Bold",
    fontFamilyCodeBoldItalic: "JetBrainsMono_700Bold_Italic",

    fontSizeH1: baseFontSize * 1.4,
    fontSizeH2: baseFontSize * 1.25,
    fontSizeH3: baseFontSize * 1.2,
    fontSizeH4: baseFontSize * 1.15,
    fontSizeH5: baseFontSize * 1.1,
    fontSizeP: baseFontSize * 1,
    fontSizeCode: baseFontSize * 0.7,

    lineHeightMinimal: baseFontSize * 1,
    lineHeightSmall: baseFontSize * 1.30,
    lineHeightComfortable: baseFontSize * 1.4,
    lineHeightCode: baseFontSize * 0.7 * 1.2,

    marginH1: baseFontSize * 1.2 * 0.4,
    marginH2: baseFontSize * 1.15 * 0.4,
    marginH3: baseFontSize * 1.12 * 0.4,
    marginH4: baseFontSize * 1.06 * 0.4,
    marginH5: baseFontSize * 1.03 * 0.4,
    marginP: baseFontSize * 0.7,
  };
}

export const appFontNames = [
  "Alegreya_400Regular",
  "Alegreya_400Regular_Italic",
  "Alegreya_700Bold",
  "Alegreya_700Bold_Italic",
  "JetBrainsMono_400Regular",
  "JetBrainsMono_400Regular_Italic",
  "JetBrainsMono_700Bold",
  "JetBrainsMono_700Bold_Italic",
];
