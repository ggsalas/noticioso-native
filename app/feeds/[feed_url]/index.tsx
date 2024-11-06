import { HTMLPagesNav } from "@/components/HTMLPagesNav";
import { PagedNavigation } from "@/components/PagedNavigation";
import { getFeedContent } from "@/domain/getFeedContent";
import { useAsyncFn } from "@/hooks/useFetch";
import { useThemeContext } from "@/theme/ThemeProvider";
import { HandleLinkData, HandleRouterLinkData } from "@/types";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, StyleSheet, Pressable } from "react-native";

export default function FeedPage() {
  const { colors, fonts, sizes } = useStyles();
  const { feed_url } = useLocalSearchParams();
  const router = useRouter();
  const { data, loading, error } = useAsyncFn(getFeedContent, feed_url);
  const content = data?.rss?.channel?.item;
  const title = data?.rss?.channel?.title;

  const actions = {
    top: {
      label: "Nothing",
      action: () => null,
    },
    bottom: {
      label: "Feeds List",
      action: () => router.back(),
    },
    first: {
      label: "Feeds List",
      action: () => router.back(),
    },
    last: {
      label: "Feeds List",
      action: () => router.back(),
    },
  };

  const handleLink = ({ href }: HandleLinkData) => {
    alert(`Unhandled link: ${href}`);
  };

  const handleRouterLink = ({ path }: HandleRouterLinkData) => {
    router.navigate(path);
  };

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

  // TODO on big screens
  // ${author ? '<div class="author">' + author + "</Text>" : ""}
  // ${ description ? '<div class="description">' + description + "</div>" : "" }
  const htmlItems = content
    .map(
      ({ title, link, description, author }: any) => `
        <div 
          class="item" 
          data-route-link="/feeds/${encodeURIComponent(
            feed_url as string
          )}/articles/${encodeURIComponent(link)}" 
        >
          <h3 class="title">${title}</h3>
        </div>
      `
    )
    .join("");

  const html = `
    <style>
      .item {
        border-bottom: 1px solid ${colors.borderDark};
        display: flex;
        flex-direction: column;
        padding: ${sizes.s1}px 0;
        text-decoration: none;
        break-inside: avoid;
      }

      .title {
        color: ${colors.text};
        font-size: ${fonts.fontSizeH4}px;
        line-height: ${fonts.lineHeightComfortable}px;
        font-weight: bold;
        margin: 0;
      }

      .author {
        color: ${colors.text};
        font-family: ${fonts.fontFamilyItalic};
        font-size: ${fonts.fontSizeP}px;
        line-height: ${fonts.lineHeightComfortable}px;
        margin-bottom: ${fonts.marginP}px;
      }

      .description {
        color: colors.text,
        font-size: ${fonts.fontSizeSmall}px;
        line-height: ${fonts.lineHeightComfortable}px;
      }
    </style>

    ${htmlItems}
  `;

  return (
    <>
      <Stack.Screen options={{ title: title }} />

      <HTMLPagesNav
        html={html}
        actions={actions}
        handleLink={handleLink}
        handleRouterLink={handleRouterLink}
      />
    </>
  );
}

function useStyles() {
  const { theme } = useThemeContext();
  const { colors, fonts, sizes } = theme;

  return { colors, fonts, sizes };
}
