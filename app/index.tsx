import { Link, Redirect, Stack } from "expo-router";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useThemeContext } from "@/theme/ThemeProvider";
import { useGetFeeds } from "@/hooks/useGetFeeds";
import { getFeeds } from "@/domain/getFeeds";
import { useAsyncFn } from "@/hooks/useFetch";

export default function Index() {
  const { style } = useStyles();
  const { data, loading, error } = useAsyncFn(getFeeds);

  if (!loading && data?.length > 0) {
    return <Redirect href="/feeds" />;
  }

  return (
    <>
      <Stack.Screen options={{ title: "Home" }} />

      {error ? (
        <Text style={style.text}>error</Text>
      ) : loading ? (
        <Text style={style.text}>Loading...</Text>
      ) : (
        <View style={style.main}>
          <Text style={style.text}>Hi, this is "El Noticioso"</Text>

          <Link href="/config" asChild>
            <Pressable style={style.button}>
              <Text style={style.buttonText}>Configure to start</Text>
            </Pressable>
          </Link>
        </View>
      )}
    </>
  );
}

function useStyles() {
  const { theme, changeFontSize } = useThemeContext();
  const { colors, fonts, sizes } = theme;

  const style = StyleSheet.create({
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: sizes.s1,
      padding: sizes.s1,
      backgroundColor: colors.background,
    },
    text: {
      color: colors.text,
      fontSize: fonts.fontSizeH1,
      fontFamily: fonts.fontFamilyBold,
      marginBottom: sizes.s1 * 4,
      marginTop: sizes.s1 * -1 * 10,
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
  });

  return { style, changeFontSize };
}
