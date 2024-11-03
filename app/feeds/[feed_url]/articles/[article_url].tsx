import { getArticle } from "@/domain/getArticle";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, StyleSheet, View } from "react-native";
import { useAsyncFn } from "@/hooks/useFetch";
import { HTMLPagesNav } from "@/components/HTMLPagesNav/index";
import { useRouter } from "expo-router";
import { useThemeContext } from "@/theme/ThemeProvider";

export default function ArticlePage() {
  const { article_url } = useLocalSearchParams();
  const router = useRouter();
  const { styles } = useStyles();

  const { data: article, loading, error } = useAsyncFn(getArticle, article_url);

  if (loading) return <Text>Loading...</Text>;

  if ((!loading && !article) || error)
    return <Text>The app has failed to get article content</Text>;

  if (!article) return <Text>Loading...</Text>;

  const actions = {
    top: {
      label: "Article List",
      action: () => router.back(),
    },
    bottom: {
      label: "Next Article",
      action: () => router.back(),
    },
    first: {
      label: "Article List (for now)",
      action: () => router.back(),
    },
    last: {
      label: "Article List (for now)",
      action: () => router.back(),
    },
  };

  const getContent = () => {
    let content = `<h1 class="_title_">${article.title}</h1>`;

    if (article.byline) {
      content += `<h2 class="_author_">${article.byline}</h3>`;
    }
    content += article.content;

    return content;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>{article.siteName}</Text>
              <Text
                style={styles.headerSubtitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {article.title}
              </Text>
            </View>
          ),
        }}
      />
      <HTMLPagesNav html={getContent()} actions={actions} />
    </>
  );
}

function useStyles() {
  const { theme } = useThemeContext();
  const { fonts, sizes, colors } = theme;

  const styles = StyleSheet.create({
    headerContainer: {
      flexShrink: 1,
      alignItems: "flex-start",
      borderColor: "red",
      paddingRight: "20%",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      lineHeight: 18,
      height: 18,
      color: colors.text,
      overflow: "hidden",
    },
  });

  return { styles };
}
