import { useThemeContext } from "@/theme/ThemeProvider";
import { StyleSheet, View, Text, Pressable } from "react-native";

export function HTMLPageNavLabels() {
  const { styles } = useStyles();

  return (
    <View style={styles.labels}>
      <View style={styles.top}>
        <Text style={styles.text}>Go to Article List</Text>
      </View>
      <View style={styles.center}>
        <View style={styles.back}>
          <Text style={styles.text}>Go to previous page</Text>
        </View>
        <View style={styles.forward}>
          <Text style={styles.text}>Go to next page</Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.text}>Go to Next Article</Text>
      </View>
    </View>
  );
}

function useStyles() {
  const { theme } = useThemeContext();
  const { fonts, sizes, colors } = theme;

  const padding = fonts.fontSizeP * 0.8;

  const styles = StyleSheet.create({
    labels: {
      backgroundColor: colors.backgroundLight,
      padding: sizes.s0_50,
      flex: 1,
    },
    text: {
      color: colors.text,
    },
    top: {
      width: "100%",
      height: "30%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: sizes.s0_25,
    },
    bottom: {
      width: "100%",
      height: "30%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    center: {
      width: "100%",
      height: "40%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "stretch",
    },
    back: {
      width: "100%",
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    forward: {
      width: "100%",
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  });

  return { styles, padding };
}
