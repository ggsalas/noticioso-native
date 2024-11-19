import { useThemeContext } from "@/theme/ThemeProvider";
import { Feed, LocalFeed } from "@/types";
import React, { useState } from "react";
import { View, TextInput, StyleSheet, Pressable, Text } from "react-native";
import { Picker, pickerStyleType } from "@react-native-picker/picker";

type FormProps = {
  item: LocalFeed;
  onSubmit: (feed: Feed) => void;
  isActive?: boolean;
};

export function Form({ item, onSubmit, isActive }: FormProps) {
  const { style } = useStyles(isActive);
  const [name, setName] = useState(item.name);
  const [url, setUrl] = useState(item.url);
  const [lang, setLang] = useState<"es" | "en">(item.lang);
  const [oldestArticle, setOldestArticle] = useState(item.oldestArticle);

  return (
    <View style={style.formContainer}>
      <TextInput
        style={style.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={style.input}
        placeholder="URL"
        value={url}
        onChangeText={setUrl}
        keyboardType="url"
      />
      <Picker
        style={style.select}
        selectedValue={lang}
        onValueChange={(itemValue) => setLang(itemValue)}
        prompt="Feed language"
        placeholder="Feed language"
        itemStyle={style.selectItem}
      >
        <Picker.Item label="Spanish" value="es" />
        <Picker.Item label="English" value="en" />
      </Picker>
      <Picker
        style={style.select}
        selectedValue={oldestArticle}
        onValueChange={(itemValue) => setOldestArticle(itemValue)}
        prompt="Read artickes from"
        placeholder="Read artickes from"
        itemStyle={style.selectItem}
      >
        <Picker.Item label="Today" value="1" />
        <Picker.Item label="Last Week" value="7" />
      </Picker>

      <Pressable
        style={style.button}
        disabled={item.isLoading}
        onPress={() =>
          onSubmit({
            ...item,
            name,
            url,
            lang,
            oldestArticle,
          })
        }
      >
        <Text style={style.buttomText}>Save Feed</Text>
      </Pressable>
    </View>
  );
}

function useStyles(isActive?: boolean) {
  const { theme } = useThemeContext();
  const { colors, fonts, sizes } = theme;

  const style = StyleSheet.create({
    formContainer: {
      paddingVertical: sizes.s1,
    },
    input: {
      fontSize: fonts.fontSizeSmall,
      height: sizes.s2,
      lineHeight: sizes.s2,
      borderColor: isActive ? colors.backgroundLight : colors.borderDark,
      color: isActive ? colors.backgroundDark_text : colors.text,
      borderWidth: 0,
      borderBottomWidth: 0.5,
      paddingHorizontal: 0,
    },
    select: {
      marginHorizontal: -16,
      height: sizes.s2,
      lineHeight: sizes.s2,
      borderBottomWidth: 0.5,
      borderColor: "red",
    },
    selectItem: {
      backgroundColor: "red",
    },
    button: {
      marginTop: sizes.s1,
      backgroundColor: isActive
        ? colors.backgroundLight
        : colors.backgroundDark,
      paddingVertical: sizes.s0_50,
      paddingHorizontal: sizes.s1,
    },
    buttomText: {
      fontSize: fonts.marginP,
      fontWeight: "bold",
      color: isActive ? colors.text : colors.backgroundDark_text,
      textAlign: "center",
    },
  });

  return { style };
}
