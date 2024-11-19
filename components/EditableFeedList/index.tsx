import { Feed } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Item } from "./Item";

type EditableFeedList = {
  feeds: Feed[];
  setFeeds: (feeds: Feed[]) => void;
};

type LocalFeed = Feed & {
  isOpen?: boolean;
  isLoading?: boolean;
};

function getFeedsFromLocalFeeds(feeds: LocalFeed[]): Feed[] {
  return feeds.map(({ isOpen, isLoading, ...feed }) => feed);
}

export const EditableFeedList = ({ feeds, setFeeds }: EditableFeedList) => {
  // To avoid swipe back the elements
  const [localFeeds, setLocalFeeds] = useOptimisticUpdates(feeds);

  const onSubmitItem = (item: LocalFeed) => {
    const updatedFeeds = feeds.map((feed) => {
      if (feed.id === item.id) return { ...item, isLoading: true };
      return feed;
    });

    setLocalFeeds(updatedFeeds);
    setFeeds(getFeedsFromLocalFeeds(updatedFeeds));
  };

  const onOpen = (item: LocalFeed) => {
    const updatedFeeds = feeds.map((feed) => {
      if (feed.id === item.id) return { ...item, isOpen: true };
      return { ...feed, isOpen: false };
    });
    setLocalFeeds(updatedFeeds);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DraggableFlatList
        data={localFeeds}
        renderItem={(props) => (
          <Item {...{ ...props, onSubmit: onSubmitItem, onOpen }} />
        )}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => {
          setLocalFeeds(data);
          setFeeds(data);
        }}
      />
    </GestureHandlerRootView>
  );
};

function useOptimisticUpdates(
  feeds: Feed[]
): [Feed[], Dispatch<SetStateAction<Feed[]>>] {
  const [localFeeds, setLocalFeeds] = useState<Feed[]>(feeds);

  useEffect(() => {
    setLocalFeeds(feeds);
  }, [feeds]);

  return [localFeeds, setLocalFeeds];
}
