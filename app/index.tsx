import { Link } from "expo-router";
import { Text, View } from "react-native";
// import { Redirect } from 'expo-router';


export default function Index() {
  // return <Redirect href="/feeds" />
  return (
    <View>
      <Text>This is the home page</Text>
      <Link href="/feeds">Feeds page</Link>
      <Link href="/feeds/1">Individual feed page</Link>
      <Link href="/feeds/1/articles/2">Individual article page</Link>
    </View>
  );
}
