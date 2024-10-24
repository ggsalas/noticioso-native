import { PagedNavigation } from "@/components/PagedNavigation";
import { getFeedContent } from "@/domain/getFeedContent";
import { useAsyncFn } from "@/hooks/useFetch";
import { useThemeContext } from "@/theme/ThemeProvider";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Text, StyleSheet, Pressable } from "react-native";

export default function FeedPage() {
  const s = useStyles();
  const { feed_url } = useLocalSearchParams();
  const { data, loading, error } = useAsyncFn(getFeedContent, feed_url);
  const content = data?.rss?.channel?.item;
  const title = data?.rss?.channel?.title;

  if (loading) return <Text>Loading...</Text>;

  if ((!loading && !content) || error)
    return (
      <>
        <Text>The app has failed to get the feed content</Text>
        <Text>content: {JSON.stringify(data, null, 4)}</Text>
        <Text>error:{JSON.stringify(error)}</Text>
      </>
    );

  if (content.length === 0) return <Text>No new content for this feed</Text>;

  return (
    <>
      <Stack.Screen options={{ title: title }} />
      <PagedNavigation withPadding="fromRenderProp">
        {({ padding }) => (
          <>
            {content.map(({ title, guid, link, description, author }: any) => (
              <Link
                href={`/feeds/${encodeURIComponent(
                  feed_url as string
                )}/articles/${encodeURIComponent(link)}`}
                key={guid}
                asChild
              >
                <Pressable style={{ ...s.item, paddingHorizontal: padding }}>
                  <Text style={s.title}>{title}</Text>
                  {author && <Text style={s.author}>{author}</Text>}
                  <Text style={s.description}>{description}</Text>
                </Pressable>
              </Link>
            ))}
          </>
        )}
      </PagedNavigation>
    </>
  );
}

function useStyles() {
  const { theme } = useThemeContext();
  const { colors, fonts, sizes } = theme;

  const styles = StyleSheet.create({
    item: {
      borderBottomWidth: 1,
      borderBottomColor: colors.borderDark,
      paddingVertical: sizes.s1,
      flexDirection: "column",
    },
    title: {
      color: colors.text,
      fontFamily: fonts.fontFamilyBold,
      fontSize: fonts.fontSizeH2,
      lineHeight: fonts.lineHeightSmall,
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
    },
  });

  return styles;
}
