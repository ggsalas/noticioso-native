import { Feed } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Item } from "./Item";

type EditableFeedList = {
  feeds: Feed[];
  setFeeds: (feeds: Feed[]) => void;
};

export const EditableFeedList = ({ feeds, setFeeds }: EditableFeedList) => {
  // To avoid swipe back the elements
  const [localFeeds, setLocalFeeds] = useOptimisticUpdates(feeds);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DraggableFlatList
        data={localFeeds}
        renderItem={Item}
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
