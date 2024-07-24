import { getFeedContent } from "@/domain/getFeedContent";
import { useThemeContext } from "@/theme/ThemeProvider";
import { FeedContent } from "@/types";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet, Pressable } from "react-native";

export default function FeedPage() {
  const s = useStyles();
  const [content, setContent] = useState<FeedContent | null>(null);
  const [feedTitle, setFeedTitle] = useState<string>("Feed no title");
  const { feed_url } = useLocalSearchParams();

  useEffect(() => {
    async function fn() {
      const data = await getFeedContent(feed_url as string);
      const feedContent = data?.rss?.channel?.item;
      if (feedContent) {
        setContent(feedContent);
        setFeedTitle(data?.rss?.channel.title);
      }
    }

    fn();
  }, []);

  if (!content) return <Text>Loading...</Text>;

  if (content.length === 0) return <Text>No new content for this feed</Text>;

  return (
    <>
      <Stack.Screen options={{ title: feedTitle }} />
      <ScrollView style={s.list}>
        {content.map(({ title, guid, link, description, author }: any) => (
          <Link
            href={`/feeds/${encodeURIComponent(
              feed_url as string
            )}/articles/${encodeURIComponent(link)}`}
            key={guid}
            asChild
          >
            <Pressable style={s.item}>
              <Text style={s.title}>{title}</Text>
              {author && <Text style={s.author}>{author}</Text>}
              <Text style={s.description}>{description}</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </>
  );
}

function useStyles() {
  const { theme } = useThemeContext();
  const { colors, fonts, sizes } = theme

  const styles = StyleSheet.create({
    list: {},
    item: {
      borderBottomWidth: 1,
      borderBottomColor: colors.borderDark,
      paddingHorizontal: sizes.s1,
      paddingVertical: sizes.s1,
      flexDirection: "column",
    },
    title: {
      color: colors.text,
      fontFamily: fonts.fontFamilyBold,
      fontSize: fonts.fontSizeH2,
      lineHeight: fonts.lineHeightSmall
    },
    author: {
      color: theme.colors.text,
      fontFamily: fonts.fontFamilyItalic,
      fontSize: fonts.fontSizeP,
      lineHeight: fonts.lineHeightComfortable,
      marginBottom: fonts.marginP,
    },
    description: {
      color: colors.text,
      fontFamily: fonts.fontFamilyRegular,
      fontSize: fonts.fontSizeP,
      lineHeight: fonts.lineHeightComfortable,
    }
  });

  return styles;
}
