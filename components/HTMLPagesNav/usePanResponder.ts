import { RefObject, useRef } from "react";
import { Animated, PanResponder } from "react-native";
import WebView from "react-native-webview";

type UseAnimationsParams = {
  width: number;
  webviewRef: RefObject<WebView>;
};

export function usePanResponder({ width, webviewRef }: UseAnimationsParams) {
  const pan = useRef(new Animated.Value(0)).current;
  const labelsOpacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20; // Activate on horizontal swipe
      },
      onPanResponderMove: (_evt, gestureState) => {
        pan.setValue(gestureState.dx); // Update the position based on swipe
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const activateSize = width / 20;

        if (
          gestureState.dx > activateSize ||
          gestureState.dx < activateSize * -1
        ) {
          const direction =
            gestureState.dx > 0 ? "SWIPE_PREVIOUS" : "SWIPE_NEXT";

          // Animate labels opacity to 0 on release
          Animated.timing(labelsOpacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }).start();

          // Swiped sufficiently left or right
          Animated.timing(pan, {
            toValue: direction === "SWIPE_PREVIOUS" ? width : -1 * width, // Move off-screen
            delay: 0,
            duration: 90,
            useNativeDriver: true,
          }).start(() => {
            // Send a message to the WebView during the release phase
            webviewRef.current?.postMessage(direction);

            // Return to original position
            Animated.timing(pan, {
              toValue: 0,
              duration: 1,
              delay: 20,
              useNativeDriver: true,
            }).start(() => {
              // Restore labels opacity
              Animated.timing(labelsOpacity, {
                toValue: 1,
                duration: 10,
                delay: 0,
                useNativeDriver: true,
              }).start();
            });
          });
        } else {
          // Reset if not swiped enough
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return { panResponder, pan, labelsOpacity };
}
