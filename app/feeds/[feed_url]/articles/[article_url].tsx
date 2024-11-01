import { getArticle } from "@/domain/getArticle";
import { useThemeContext } from "@/theme/ThemeProvider";
import { appFontNames } from "@/theme/fonts";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, StyleSheet, useWindowDimensions } from "react-native";
import HTMLRenderer, {
  MixedStyleRecord,
  defaultSystemFonts,
} from "react-native-render-html";
import { PagedNavigation } from "@/components/PagedNavigation";
import { useAsyncFn } from "@/hooks/useFetch";
import { HTMLPagesNav } from "@/components/HTMLPagesNav";

export default function ArticlePage() {
  const { s, tagsStyles } = useStyles();
  const { width } = useWindowDimensions();
  const { article_url } = useLocalSearchParams();

  const { data: article, loading, error } = useAsyncFn(getArticle, article_url);

  if (loading) return <Text>Loading...</Text>;

  if ((!loading && !article) || error)
    return <Text>The app has failed to get article content</Text>;

  if (!article) return <Text>Loading...</Text>;

  return (
    <>
      <Stack.Screen options={{ title: article.title }} />
      <HTMLPagesNav html={article.content} />
    </>
  );
}

function useStyles() {
  const { theme } = useThemeContext();
  const { colors, fonts } = theme;

  const styles = StyleSheet.create({
    articleTitle: {
      color: colors.text,
      fontSize: fonts.fontSizeH1,
      fontFamily: fonts.fontFamilyBold,
      marginBottom: fonts.marginH1,
      marginTop: fonts.marginP,
    },
  });

  const content = {
    color: colors.text,
    fontSize: fonts.baseFontSize,
    fontFamily: fonts.fontFamilyRegular,
  };

  const tagsStyles: MixedStyleRecord = {
    body: {
      color: colors.text,
      fontSize: fonts.fontSizeP,
      lineHeight: fonts.lineHeightSmall,
      fontFamily: fonts.fontFamilyRegular,
    },
    p: {
      lineHeight: fonts.lineHeightComfortable,
      marginTop: 0,
      marginBottom: fonts.marginP,
    },
    a: {
      color: colors.text,
      fontFamily: fonts.fontFamilyRegular,
      fontWeight: "light",
      textDecorationStyle: "solid",
    },
    strong: {
      fontFamily: fonts.fontFamilyBold,
      fontWeight: "400",
      textDecorationStyle: "solid",
    },
    em: {
      fontFamily: fonts.fontFamilyBoldItalic,
      fontStyle: "normal",
      fontWeight: "400",
    },
    figcaption: {
      fontFamily: fonts.fontFamilyItalic,
      fontStyle: "normal",
      fontWeight: "400",
    },
    h1: {
      fontFamily: fonts.fontFamilyRegular,
      fontWeight: "400",
      fontSize: fonts.fontSizeH1,
    },
    h2: {
      fontFamily: fonts.fontFamilyRegular,
      fontWeight: "400",
      fontSize: fonts.fontSizeH2,
    },
    h3: {
      fontFamily: fonts.fontFamilyRegular,
      fontWeight: "400",
      fontSize: fonts.fontSizeH3,
    },
    h4: {
      fontFamily: fonts.fontFamilyRegular,
      fontWeight: "400",
      fontSize: fonts.fontSizeH4,
    },
    h5: {
      fontFamily: fonts.fontFamilyRegular,
      fontWeight: "400",
      fontSize: fonts.fontSizeH5,
    },
    pre: {
      fontFamily: fonts.fontFamilyCodeRegular,
      fontSize: fonts.fontSizeCode,
      lineHeight: fonts.lineHeightCode,
    },
    code: {
      fontSize: fonts.fontSizeCode,
    },
  };

  return { s: styles, content, tagsStyles };
}
