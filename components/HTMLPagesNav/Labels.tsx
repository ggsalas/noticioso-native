import { useThemeContext } from "@/theme/ThemeProvider";
import { Pages } from "@/types";
import { StyleSheet, View, Text, Pressable } from "react-native";

type HTMLPageNavLabelsProps = {
  topLabel?: string;
  bottomLabel?: string;
  leftLabel: string | null;
  rightLabel: string | null;
};

export function Labels({
  topLabel,
  bottomLabel,
  leftLabel = "Previous Page",
  rightLabel = "Next Page",
}: HTMLPageNavLabelsProps) {
  const { styles } = useStyles();

  return (
    <View style={styles.labels}>
      {topLabel && (
        <View style={styles.top}>
          <Text style={styles.text}>{topLabel}</Text>
        </View>
      )}
      <View style={styles.center}>
        <View style={styles.left}>
          <Text style={styles.text}>{leftLabel}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.text}>{rightLabel}</Text>
        </View>
      </View>
      {bottomLabel && (
        <View style={styles.bottom}>
          <Text style={styles.text}>{bottomLabel}</Text>
        </View>
      )}
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
      flexGrow: 1,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "stretch",
    },
    left: {
      width: "100%",
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    right: {
      width: "100%",
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  });

  return { styles, padding };
}
