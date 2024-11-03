import { getArticle } from "@/domain/getArticle";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { useAsyncFn } from "@/hooks/useFetch";
import { HTMLPagesNav } from "@/components/HTMLPagesNav/index";
import { useRouter } from "expo-router";

export default function ArticlePage() {
  const { article_url } = useLocalSearchParams();
  const router = useRouter();

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
      <Stack.Screen options={{ title: article.title }} />
      <HTMLPagesNav html={getContent()} actions={actions} />
    </>
  );
}
