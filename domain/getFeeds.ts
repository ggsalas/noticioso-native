import { Feed } from "~/types";

import AsyncStorage from "@react-native-async-storage/async-storage";

const FEEDS_LIST_KEY = "@noticioso-feedList";

export async function getFeeds(): Promise<Array<Feed> | undefined> {
  const feedsData = await AsyncStorage.getItem(FEEDS_LIST_KEY);

  if (feedsData !== null) {
    return JSON.parse(feedsData) as Feed[];
  } else {
    throw new Error("No feeds found");
  }
}

export async function getFeedByUrl(url: string): Promise<Feed | undefined> {
  const feeds = await getFeeds();

  return feeds?.find((f) => f.url.includes(url));
}

export async function saveFeeds(feeds: Feed[]) {
  if (feeds.length > 0) {
    const feedsData = JSON.stringify(feeds);
    await AsyncStorage.setItem(FEEDS_LIST_KEY, feedsData);
  } else {
    throw new Error("No feeds to save");
  }
}

export async function removeAllFeeds() {
  await AsyncStorage.setItem(FEEDS_LIST_KEY, "");
}

export async function importFeeds(data: string) {
  const feeds = JSON.parse(data) as Feed[];
  const hasItems = feeds.length > 0;
  const hasValues =
    feeds[0].name &&
    feeds[0].url &&
    feeds[0].oldestArticle >= 1 &&
    feeds[0].lang;

  if (hasItems && hasValues) {
    await AsyncStorage.setItem(FEEDS_LIST_KEY, data);

    return true;
  } else {
    throw new Error("Data has incorect format");
  }
}
