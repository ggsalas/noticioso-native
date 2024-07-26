import { Link, Stack } from "expo-router";
import { Text, StyleSheet, ScrollView } from "react-native";
import { getFeeds } from "../../domain/getFeeds";
import { useEffect, useState } from "react";
import { Feed } from "@/types";
import { useThemeContext } from "@/theme/ThemeProvider";
import { PagedNavigation } from "@/components/PagedNavigation";

export default function Feeds() {
  const [feeds, setFeeds] = useState<Feed[]>();
  const s = useStyles();

  useEffect(() => {
    async function fn() {
      const data = await getFeeds();
      data && setFeeds(data);
    }

    fn();
  }, []);

  if (!feeds) return <Text>Loading...</Text>;

  if (feeds.length === 0) return <Text>No feeds</Text>;

  return (
    <>
      <Stack.Screen options={{ title: "Feeds" }} />
      <PagedNavigation>
        {feeds.map(({ url, name }) => (
          <Link
            style={s.item}
            key={name}
            href={`/feeds/${encodeURIComponent(url)}`}
          >
            {name}
          </Link>
        ))}
      </PagedNavigation>
    </>
  );
}

function useStyles() {
  const { theme } = useThemeContext();
  const { colors, sizes, fonts } = theme;

  const styles = StyleSheet.create({
    item: {
      borderBottomWidth: 1,
      borderBottomColor: colors.borderDark,
      color: colors.text,
      fontSize: fonts.fontSizeP,
      fontFamily: fonts.fontFamilyBold,
      paddingHorizontal: sizes.s0_50,
      paddingVertical: sizes.s1,
      display: "flex",
      flexDirection: "column",
    },
  });

  return styles;
}
