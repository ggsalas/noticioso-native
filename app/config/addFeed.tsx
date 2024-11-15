import { View, Text } from "react-native";
import { useFeedsContext } from "@/providers/FeedsProvider";
import { EditableFeedList } from "@/components/EditableFeedList";

export default function AddFeed() {
  const { feeds, loading, updateFeeds } = useFeedsContext();

  if (loading && (!feeds || feeds.length === 0)) return <Text>Loading...</Text>;

  if (!feeds || feeds.length === 0) return <Text>No feeds has been added</Text>;

  return <EditableFeedList feeds={feeds} setFeeds={updateFeeds} />;
}
