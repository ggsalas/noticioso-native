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
      <Text style={styles.amount}>{` of ${pages.amount}`}</Text>
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
      marginTop: sizes.s1,
      marginBottom: sizes.s1,
      marginLeft: sizes.s1,
      marginRight: sizes.s1,
    },
    current: {
      fontSize: fonts.marginP,
      fontWeight: "bold",
      color: colors.text,
    },
    amount: {
      fontSize: fonts.marginP,
      fontWeight: "normal",
      color: colors.text,
    },
  });

  return { styles };
}
