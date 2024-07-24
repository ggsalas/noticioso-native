import { getArticle } from "@/domain/getArticle";
import { useThemeContext } from "@/theme/ThemeProvider";
import { appFontNames } from "@/theme/fonts";
import { Article } from "@/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import HTMLRenderer, {
  MixedStyleRecord,
  defaultSystemFonts,
} from "react-native-render-html";

export default function ArticlePage() {
  const { s, content, tagsStyles } = useStyles();
  const [article, setArticle] = useState<Article>(null);
  const { article_url } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  useEffect(() => {
    async function fn() {
      if (!article_url) throw new Error("missing article_url on article page");

      const data = await getArticle(article_url as string);
      if (data) {
        setArticle(data);
      }
    }

    fn();
  }, []);

  if (!article) return <Text>Loading...</Text>;

  console.log(article.content);
  return (
    <>
      <Stack.Screen options={{ title: article.title }} />
      <ScrollView contentContainerStyle={s.container}>
        <HTMLRenderer
          tagsStyles={tagsStyles}
          systemFonts={[...defaultSystemFonts, ...appFontNames]}
          source={{ html: article.content }}
          contentWidth={width - s.container.padding * 2}
          ignoredDomTags={["source", "iframe", "video"]} // TODO: support iframe, video
          enableCSSInlineProcessing={false}
          ignoredStyles={["fontFamily"]}
        />
      </ScrollView>
    </>
  );
}

function useStyles() {
  const { theme } = useThemeContext();
  const { colors, fonts, sizes } = theme;

  const styles = StyleSheet.create({
    container: {
      color: colors.text,
      padding: 16,
    },
  });

  const content = {
    color: colors.text,
    fontSize: fonts.baseFontSize,
    fontFamily: fonts.fontFamilyRegular,
  };

  const lists = {
    fontFamily: fonts.fontFamilyRegular,
    lineHeight: fonts.lineHeightComfortable,
    marginTop: 0,
    marginBottom: fonts.marginP,
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
      fontSize: fonts.fontSizeH1
    },
    h2: {
      fontFamily: fonts.fontFamilyRegular,
      fontWeight: "400",
      fontSize: fonts.fontSizeH2
    },
    h3: {
      fontFamily: fonts.fontFamilyRegular,
      fontWeight: "400",
      fontSize: fonts.fontSizeH3
    },
    h4: {
      fontFamily: fonts.fontFamilyRegular,
      fontWeight: "400",
      fontSize: fonts.fontSizeH4
    },
    h5: {
      fontFamily: fonts.fontFamilyRegular,
      fontWeight: "400",
      fontSize: fonts.fontSizeH5
    },
    code: {
      fontFamily: fonts.fontFamilyCodeRegular,
      fontSize: fonts.fontSizeCode,
      lineHeight: fonts.lineHeightCode,
    }
  };

  return { s: styles, content, tagsStyles };
}
