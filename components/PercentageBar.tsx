import { useThemeContext } from "@/theme/ThemeProvider";
import { View, StyleSheet } from "react-native";

type PercentageBarProps = {
  percentage: number;
}

export function PercentageBar({ percentage }: PercentageBarProps) {
  const { styles } = useStyles(percentage);

  return (
    <View style={styles.container}>
      <View style={styles.bar} />
    </View>
  );
}

function useStyles(percentage: number = 0) {
  const { theme } = useThemeContext();
  const { sizes, colors } = theme;

  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
    },
    bar: {
      backgroundColor: colors.borderDark,
      height: sizes.s0_25,
      width: `${percentage}%`,
    },
  });

  return { styles };
}
