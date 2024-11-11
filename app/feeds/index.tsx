import { Stack, useRouter } from "expo-router";
import { Text } from "react-native";
import { getFeeds } from "../../domain/getFeeds";
import { useEffect, useState } from "react";
import { Feed, HandleRouterLinkData } from "@/types";
import { useThemeContext } from "@/theme/ThemeProvider";
import { HTMLPagesNav } from "@/components/HTMLPagesNav";
import { usePreviousRoute } from "@/hooks/usePreviousRoute";

export default function Feeds() {
  const { colors, fonts, sizes } = useStyles();
  const { data, loading, error } = useGetFeeds();
  const router = useRouter();

  const previousRoute = usePreviousRoute();
  const previousArticleUrl = (previousRoute?.params as { feed_url: string })
    ?.feed_url;

  const getRouteLink = (link: string) => `/feeds/${encodeURIComponent(link)}`;

  const actions = {
    top: {
      label: "Nothing",
      action: () => null,
    },
    bottom: {
      label: "Home",
      action: () => router.back(),
    },
    first: {
      label: "Home",
      action: () => router.back(),
    },
    last: {
      label: "Home",
      action: () => router.back(),
    },
  };

  const handleRouterLink = ({ path }: HandleRouterLinkData) => {
    router.navigate(path);
  };

  const htmlItems =
    data?.length === 0
      ? '<div class="no-new-conent">No feeds found</div>'
      : data
          ?.map(
            ({ name, url }: any) => `
            <div 
              class="item" 
              data-route-link="${getRouteLink(url)}" 
            >
              <h3 class="title">${name}</h3>
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

      .item[data-route-link*="${previousArticleUrl}"] {
        border-bottom-width: 5px;
      }

      .title {
        color: ${colors.text};
        font-size: ${fonts.fontSizeH4}px;
        line-height: ${fonts.lineHeightComfortable}px;
        font-weight: bold;
        margin: 0;
      }

      .no-new-conent {
        color: ${colors.text};
        font-size: ${fonts.fontSizeP}px;
        font-weight: bold;
        line-height: ${fonts.lineHeightComfortable}px;
        margin: 0;
        padding: ${sizes.s1}px 0;
      }
    </style>

    ${htmlItems}
  `;

  if (loading) {
    return (
      <Text style={{ color: colors.text, padding: sizes.s1 }}>Loading...</Text>
    );
  }

  if ((!loading && !data) || error) {
    return (
      <>
        <Text>The app has failed to get the feed list</Text>
        <Text>content: {JSON.stringify(data, null, 4)}</Text>
        <Text>error:{JSON.stringify(error)}</Text>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Feeds" }} />

      <HTMLPagesNav
        name="feed"
        html={html}
        actions={actions}
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

function useGetFeeds() {
  const [feeds, setFeeds] = useState<Feed[]>();

  useEffect(() => {
    async function fn() {
      const data = await getFeeds();
      data && setFeeds(data);
    }

    fn();
  }, []);

  return {
    data: feeds,
    loading: !feeds,
    error: false,
  };
}
