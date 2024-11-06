import { ParamListBase, RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";

export function usePreviousRoute() {
  const navigation = useNavigation();
  const route = useRoute();
  const [previousRoute, setPreviousRoute] =
    useState<RouteProp<ParamListBase> | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e) => {
      const currentRoute = e.data.state.routes[e.data.state.index];

      if (currentRoute.name !== route.name) {
        setPreviousRoute(currentRoute);
      }
    });

    return unsubscribe;
  }, [navigation, route]);

  return previousRoute;
}
