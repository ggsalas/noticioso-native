import { Link, Stack } from "expo-router";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getFeeds } from "../../domain/getFeeds";
import { useEffect, useState } from "react";
import { Feed } from "@/types";

export default function Feeds() {
  const [feeds, setFeeds] = useState<Feed[]>();

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
      <ScrollView style={styles.list}>
        {feeds.map(({ url, name }) => (
          <Link
            style={styles.item}
            key={name}
            href={`/feeds/${encodeURIComponent(url)}`}
          >
            {name}
          </Link>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 40,
    display: "flex",
    flexDirection: "column",
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
    display: "flex",
    flexDirection: "column",
  },
});
