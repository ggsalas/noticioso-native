import { useThemeContext } from "@/theme/ThemeProvider";
import { Feed } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

type ItemProps = {
  item: Feed;
  drag: () => void;
  isActive: boolean;
};

export function Item({ item, drag, isActive }: ItemProps) {
  const { style, colors } = useStyles(isActive);

  return (
    <TouchableOpacity style={style.container} onLongPress={drag}>
      <Text style={style.label}>{item.name}</Text>
      <TouchableOpacity onPressIn={drag}>
        <MaterialIcons
          name="drag-indicator"
          size={24}
          color={isActive ? colors.backgroundDark_text : colors.text}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function useStyles(isActive: boolean) {
  const { theme } = useThemeContext();
  const { colors, fonts, sizes } = theme;

  const style = StyleSheet.create({
    container: {
      backgroundColor: isActive ? colors.backgroundDark : colors.background,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderBottomColor: colors.borderDark,
      paddingHorizontal: sizes.s1,
      paddingVertical: sizes.s1,
    },
    label: {
      fontSize: fonts.fontSizeP,
      lineHeight: fonts.lineHeightMinimal,
      color: isActive ? colors.backgroundDark_text : colors.text,
      fontFamily: fonts.fontFamilyRegular,
    },
  });

  return { style, colors };
}
