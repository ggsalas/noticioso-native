import { View, Text, StyleSheet } from "react-native";
import { Pages } from "@/types";
import { useThemeContext } from "@/theme/ThemeProvider";

type PageIndicatorProps = {
  pages: Pages;
};

export function PageIndicator({ pages }: PageIndicatorProps) {
  const { styles } = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.current}>{`Page ${pages.current}`}</Text>
      <Text style={styles.amount}>{`  of  ${pages.amount}`}</Text>
    </View>
  );
}

function useStyles() {
  const { theme } = useThemeContext();
  const { fonts, sizes, colors } = theme;

  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "baseline",
      width: "100%",
      paddingTop: sizes.s1,
      paddingBottom: sizes.s1,
      paddingLeft: sizes.s1,
      paddingRight: sizes.s1,
    },
    current: {
      fontFamily: fonts.fontFamilyBold,
      fontSize: fonts.fontSizeP,
      color: colors.text,
    },
    amount: {
      fontFamily: fonts.fontFamilyItalic,
      fontSize: fonts.fontSizeSmall,
      fontWeight: "normal",
      color: colors.text,
    },
  });

  return { styles };
}
