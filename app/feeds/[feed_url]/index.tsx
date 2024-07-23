import { getFeedContent } from "@/domain/getFeedContent";
import { FeedContent } from "@/types";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet, Pressable } from "react-native";

export default function FeedPage() {
  const [content, setContent] = useState<FeedContent | null>(null);
  const [feedTitle, setFeedTitle] = useState<string>('Feed no title');
  const { feed_url } = useLocalSearchParams();

  useEffect(() => {
    async function fn() {
      const data = await getFeedContent(feed_url as string);
      const feedContent = data?.rss?.channel?.item;
      if (feedContent) {
        setContent(feedContent);
        setFeedTitle(data?.rss?.channel.title)
      }

    }

    fn();
  }, []);

  if (!content) return <Text>Loading...</Text>;

  if (content.length === 0) return <Text>No new content for this feed</Text>;

  return (
    <>
      <Stack.Screen options={{ title: feedTitle }} />
      <ScrollView style={styles.list}>
        {content.map(({ title, guid, link, description, author }: any) => (
          <Link
            href={`/feeds/${encodeURIComponent(
              feed_url as string
            )}/articles/${encodeURIComponent(link)}`}
            key={guid}
            asChild
          >
            <Pressable style={styles.item}>
              <Text style={styles.title}>{title}</Text>
              <Text>{author}</Text>
              <Text>{description}</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  list: {},
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "column",
  },
  title: {
    fontWeight: "bold",
  },
});
