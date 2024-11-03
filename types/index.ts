import { Readability } from "@mozilla/readability";
import type { getFeedContent } from "../domain/getFeedContent";
import { NativeSyntheticEvent } from "react-native";

type ReadabilityArticle = ReturnType<Readability["parse"]>;

export type Article = ReadabilityArticle;

export type OldestArticle = 1 | 7;

export interface Feed {
  name: string;
  url: string;
  oldestArticle: OldestArticle;
  lang: "en" | "es";
}

export type Navigation = {
  nextUrl: string;
  prevUrl: string;
  currentFeed?: string;
};

export type FeedContentItem = {
  title: string;
  link: string;
  pubDate: string;
  author?: string;
  description: string; // can have images
  "content:encoded"?: string; // can have images
  /* guid
   *
   * media:description
   * media:credit
   * content:encoded
   */
};

export type FeedContent = FeedContentItem[];

export type Channel = {
  title: string;
  description: string;
  language: string;
  link: string;
  lastBuildDate: string;
  item: FeedContent;
};

export type FeedData = {
  date: Date;
  rss: {
    channel: Channel;
  };
};

// UI

export type Pages = {
  amount: number;
  current: number;
  isFirst: Boolean;
  isLast: Boolean;
};

export type HTMLPagesNavActionItem = {
  label: string;
  action: () => void;
};

export type HTMLPagesNavActions = {
  top?: HTMLPagesNavActionItem;
  bottom?: HTMLPagesNavActionItem;
  first: HTMLPagesNavActionItem;
  last: HTMLPagesNavActionItem;
};
