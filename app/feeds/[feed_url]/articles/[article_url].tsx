import { getArticle } from "@/domain/getArticle";
import { Article } from "@/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import HTMLRenderer from "react-native-render-html";

export default function ArticlePage() {
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

  return (
    <>
      <Stack.Screen options={{ title: article.title }} />
      <ScrollView contentContainerStyle={styles.container}>
        <HTMLRenderer
          source={{ html: article.content }}
          contentWidth={width - styles.container.padding * 2}
          ignoredDomTags={["source"]}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
