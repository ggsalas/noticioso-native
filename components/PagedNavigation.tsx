import { useThemeContext } from "@/theme/ThemeProvider";
import { ReactNode } from "react";
import { ScrollView, View, StyleSheet } from "react-native";

type WithPadding = 'fromContainer' | 'fromRenderProp';
type PagedNavigationProps = {
  withPadding: WithPadding;
  children: ReactNode | ((props: { padding: number }) => ReactNode);
}

export function PagedNavigation({
  children,
  withPadding,
}: PagedNavigationProps) {
  const { styles, padding } = useStyles(withPadding);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {typeof children === "function" ? children({ padding }) : children}
      </View>
    </ScrollView>
  );
}

function useStyles(withPadding?: WithPadding) {
  const { theme } = useThemeContext();
  const { fonts } = theme;

  const padding = fonts.fontSizeP * .8;

  function widthOfParagraphChars(amount: number) {
    return (amount * fonts.fontSizeP) / 2.3 + padding * 2;
  }

  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "column",
    },
    content: {
      width: "100%",
      maxWidth: widthOfParagraphChars(60),
      marginHorizontal: "auto",
      borderWidth: 1,
      borderStyle: "solid",
      paddingHorizontal: withPadding === 'fromContainer' ? padding : 0,
    },
  });

  return { styles, padding };
}
