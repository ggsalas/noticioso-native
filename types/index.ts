import { Readability } from "@mozilla/readability";

type ReadabilityArticle = ReturnType<Readability["parse"]>;

export type Article = ReadabilityArticle;

export type OldestArticle = 1 | 7;

export interface Feed {
  id: string;
  name: string;
  url: string;
  oldestArticle: OldestArticle;
  lang: "en" | "es";
}

export type LocalFeed = Feed & {
  isOpen?: boolean;
  isLoading?: boolean;
};

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
  scrollLeft: number;
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

export type HandleLinkData = {
  href: string;
};

export type HandleRouterLinkData = {
  path: string;
};
