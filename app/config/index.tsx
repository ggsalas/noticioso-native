import { Link, Stack } from "expo-router";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TextInputChangeEventData,
  NativeSyntheticEvent,
} from "react-native";
import { useThemeContext } from "@/theme/ThemeProvider";
import { useEffect, useState } from "react";
import { useFeedsContext } from "@/providers/FeedsProvider";

export default function Index() {
  const { s, changeFontSize } = useStyles();
  const {
    importedFeeds,
    importError,
    loading,
    handleOnChange,
    handleOnFeedsImport,
    onBlur,
    importSuccess,
  } = useImportForm();

  return (
    <>
      <Stack.Screen options={{ title: "Configuration" }} />

      <ScrollView>
        <View style={s.main}>
          <View style={s.hero}>
            <Text style={s.testText}>Import FEEDS</Text>

            <TextInput
              value={importedFeeds}
              multiline={true}
              numberOfLines={8}
              textAlignVertical="top"
              onChange={handleOnChange}
              placeholder="Paste feeds data in JSON format"
              style={s.input}
              editable={!loading}
              onBlur={onBlur}
            />

            {importSuccess && <Text>Imported correctly!</Text>}
            {importError && <Text>Error: {importError}</Text>}

            <Pressable style={s.button} onPress={handleOnFeedsImport}>
              <Text style={s.buttonText}>Import</Text>
            </Pressable>
          </View>
        </View>

        <View style={s.main}>
          <View style={s.hero}>
            <Text style={s.heroText}>Welcome to El Noticioso</Text>

            <Link href="/feeds" asChild>
              <Pressable style={s.button}>
                <Text style={s.buttonText}>Read</Text>
              </Pressable>
            </Link>
          </View>

          <View style={s.hero}>
            <Text style={s.heroText}>Configure font size</Text>
            <Text style={s.testText}>
              This is a example of text, to adjust the height as you need
            </Text>

            <Pressable
              style={s.button}
              onPress={() => changeFontSize && changeFontSize("increase")}
            >
              <Text style={s.buttonText}>Increase</Text>
            </Pressable>
            <Pressable
              style={s.button}
              onPress={() => changeFontSize && changeFontSize("decrease")}
            >
              <Text style={s.buttonText}> Decrease </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function useStyles() {
  const { theme, changeFontSize } = useThemeContext();
  const { colors, fonts, sizes } = theme;

  const style = StyleSheet.create({
    main: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      gap: sizes.s1,
      padding: sizes.s1,
      backgroundColor: colors.background,
    },
    hero: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: sizes.s1,
      borderColor: colors.borderDark,
      borderRadius: sizes.s0_50,
      borderWidth: 1,
      padding: sizes.s2,
    },
    heroText: {
      color: colors.text,
      fontSize: fonts.fontSizeH1,
      fontFamily: fonts.fontFamilyBold,
    },
    testText: {
      color: colors.text,
      fontSize: fonts.fontSizeP,
      fontFamily: fonts.fontFamilyRegular,
    },
    button: {
      backgroundColor: colors.text,
      paddingVertical: sizes.s0_50,
      paddingHorizontal: sizes.s1,
      fontSize: fonts.baseFontSize,
    },
    buttonText: {
      color: colors.backgroundDark_text,
    },
    input: {
      borderColor: colors.borderDark,
      borderWidth: 1,
    },
  });

  return { s: style, changeFontSize };
}

function useImportForm() {
  const { feeds, loading, importFeeds } = useFeedsContext();
  const [importedFeeds, setImportedFeeds] = useState<string>("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);

  useEffect(() => {
    if (!loading && feeds) {
      setImportedFeeds(JSON.stringify(feeds));
    }
  }, [loading, feeds]);

  const handleOnFeedsImport = async () => {
    try {
      await importFeeds(importedFeeds);
      setImportSuccess(true);
    } catch (e) {
      setImportError((e as Error).message);
    }
  };

  const handleOnChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setImportError("");
    setImportSuccess(false);
    setImportedFeeds(e.nativeEvent.text);
  };

  const onBlur = () => {
    setImportError("");
    setImportSuccess(false);
  };

  return {
    loading,
    importedFeeds,
    importError,
    importSuccess,
    handleOnChange,
    handleOnFeedsImport,
    onBlur,
  };
}
