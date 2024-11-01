import { useThemeContext } from "@/theme/ThemeProvider";
import { ReactNode, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  View,
  Text,
} from "react-native";
// import { PercentageBar } from "./PercentageBar";
import { WebView } from "react-native-webview";
import { getHorizontalNavigationPage } from "../lib/horizontalNavigation";
import { HTMLPageNavLabels } from "./HTMLPagesNavLabels";

type HTMLPaesNavProps = {
  html: string;
};

export function HTMLPagesNav({ html }: HTMLPaesNavProps) {
  const { width } = Dimensions.get("window");
  const { styles, theme } = useStyles(width);
  const webviewRef = useRef(null);

  const content = getHorizontalNavigationPage({
    content: html,
    width: styles.webView.width,
    theme,
  });

  const pan = useRef(new Animated.Value(0)).current;
  const labelsOpacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20; // Activate on horizontal swipe
      },
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue(gestureState.dx); // Update the position based on swipe
      },
      onPanResponderRelease: (evt, gestureState) => {
        const activateSize = width / 6;

        // Set to invisible and reset after a delay
        if (
          gestureState.dx > activateSize ||
          gestureState.dx < activateSize * -1
        ) {
          const direction =
            gestureState.dx > 0 ? "SWIPE_PREVIOUS" : "SWIPE_NEXT";

          // Animate labels opacity to 0 on release
          Animated.timing(labelsOpacity, {
            toValue: 0, // Set labels opacity to 0
            duration: 0,
            useNativeDriver: true,
          }).start();

          // Swiped sufficiently left or right
          Animated.parallel([
            Animated.spring(pan, {
              toValue: direction === "SWIPE_PREVIOUS" ? width : -1 * width, // Move off-screen
              delay: 0,
              speed: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Send a message to the WebView during the release phase
            webviewRef.current?.postMessage(direction);

            // After the animations complete, reset position
            Animated.parallel([
              Animated.timing(pan, {
                toValue:
                  direction === "SWIPE_PREVIOUS" ? -2 * width : 2 * width,
                duration: 0,
                delay: 0,
                useNativeDriver: true,
              }),
            ]).start(() => {
              Animated.parallel([
                Animated.timing(pan, {
                  toValue: 0, // Return to original position
                  duration: 40,
                  delay: 0,
                  useNativeDriver: true,
                }),
              ]).start();

              // Restore labels opacity
              Animated.timing(labelsOpacity, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true,
                delay: 40,
              }).start();
            });
          });
        } else {
          // Reset if not swiped enough
          Animated.parallel([
            Animated.spring(pan, {
              toValue: 0,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const onMessage = (event) => {
    console.log("Message from WebView:", event.nativeEvent.data);
    // Handle the message received from the WebView here
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.labels, { opacity: labelsOpacity }]}>
        <HTMLPageNavLabels />
      </Animated.View>

      <Animated.View
        style={[styles.pan, { transform: [{ translateX: pan }] }]}
        {...panResponder.panHandlers}
      >
        <WebView
          ref={webviewRef}
          style={styles.webView}
          originWhitelist={["*"]}
          source={{ html: content }}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          scalesPageToFit={false}
          onMessage={onMessage} // Listen for messages from the WebView
        />
      </Animated.View>
    </View>
  );
}

function useStyles(windowWidth: number) {
  const { theme } = useThemeContext();
  const { fonts, sizes, colors } = theme;

  const padding = fonts.fontSizeP * 0.8;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundLight,
      flex: 1,
      position: "relative",
    },
    pan: {
      flex: 1,
      overflow: "hidden",
      backgroundColor: colors.background,
      elevation: 7,
    },
    webView: {
      width: windowWidth - sizes.s1 * 2,
      margin: sizes.s1,
      overflow: "hidden",
      backgroundColor: "transparent",
    },
    labels: {
      position: "absolute",
      height: "100%",
      width: "100%",
    },
  });

  return { styles, padding, theme };
}
