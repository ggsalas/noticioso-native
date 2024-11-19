import { useThemeContext } from "@/theme/ThemeProvider";
import { LocalFeed } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Form } from "./Form";

type ItemProps = {
  item: LocalFeed;
  drag: () => void;
  isActive: boolean;
  onSubmit: (feed: LocalFeed) => void;
  onOpen: (feed: LocalFeed) => void;
};

export function Item({ item, drag, isActive, onSubmit, onOpen }: ItemProps) {
  const { style, colors } = useStyles(isActive);

  return (
    <TouchableOpacity
      style={style.container}
      onPress={() => onOpen(item)}
      onLongPress={drag}
    >
      <View style={style.title}>
        <Text style={style.label}>{item.name}</Text>
        <TouchableOpacity onPressIn={drag}>
          <MaterialIcons
            name="drag-indicator"
            size={24}
            color={isActive ? colors.backgroundDark_text : colors.text}
          />
        </TouchableOpacity>
      </View>

      {item.isOpen && (
        <Form item={item} onSubmit={onSubmit} isActive={isActive} />
      )}
    </TouchableOpacity>
  );
}

function useStyles(isActive: boolean) {
  const { theme } = useThemeContext();
  const { colors, fonts, sizes } = theme;

  const style = StyleSheet.create({
    container: {
      backgroundColor: isActive ? colors.backgroundDark : colors.background,
      flexDirection: "column",
      borderWidth: 1,
      borderBottomColor: colors.borderDark,
      paddingHorizontal: sizes.s1,
      paddingVertical: sizes.s1,
    },
    title: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    label: {
      fontSize: fonts.fontSizeP,
      lineHeight: fonts.lineHeightMinimal,
      color: isActive ? colors.backgroundDark_text : colors.text,
      fontFamily: "",
    },
    form: {
      height: 20,
      backgroundColor: "red",
    },
  });

  return { style, colors };
}
