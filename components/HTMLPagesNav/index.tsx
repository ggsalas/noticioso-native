import { useThemeContext } from "@/theme/ThemeProvider";
import { useRef, useState } from "react";
import { StyleSheet, Dimensions, Animated, View } from "react-native";
// import { PercentageBar } from "./PercentageBar";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { getHorizontalNavigationPage } from "../../lib/horizontalNavigation";
import { Labels } from "./Labels";
import { usePanResponder } from "./usePanResponder";
import { HTMLPagesNavActions, Pages } from "@/types";
import { PageIndicator } from "./PageIndicator";

type HTMLPaesNavProps = {
  html: string;
  actions: HTMLPagesNavActions;
};

export function HTMLPagesNav({ html, actions }: HTMLPaesNavProps) {
  const webviewRef = useRef(null);
  const { width } = Dimensions.get("window");
  const { styles, theme } = useStyles(width);
  const [pages, setPages] = useState<Pages>({
    isFirst: true,
  } as unknown as Pages);
  const { panResponder, pan, elevation, labelsOpacity } = usePanResponder({
    width,
    webviewRef,
  });

  const content = getHorizontalNavigationPage({
    content: html,
    width: styles.webView.width,
    theme,
  });

  // Receives messages from JS inside page content
  const onMessage = (event: WebViewMessageEvent) => {
    const stringifyData = event.nativeEvent.data;
    const { viewportWidth, articleWidth, scrollLeft, eventName } =
      JSON.parse(stringifyData) ?? {};

    const handlePages = () =>
      setPages(() => {
        const amount = Math.ceil(articleWidth / viewportWidth);
        const current = scrollLeft / viewportWidth + 1;
        const isFirst = scrollLeft == 0;
        const isLast = amount == current;

        return {
          amount,
          current,
          isFirst,
          isLast,
        };
      });

    switch (eventName) {
      case "SWIPE_NEXT":
        if (pages.isLast) {
          return actions.last.action();
        } else {
          handlePages();
          return;
        }
      case "SWIPE_PREVIOUS":
        if (pages.isFirst) {
          return actions.first.action();
        } else {
          handlePages();
          return;
        }
      case "SWIPE_TOP":
        return actions.top && actions.top.action();
      case "SWIPE_BOTTOM":
        return actions.bottom && actions.bottom.action();
      default:
        handlePages();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.labels, { opacity: labelsOpacity }]}>
        <Labels
          leftLabel={
            pages.isFirst && actions.first?.label
              ? actions.first.label
              : "Previous"
          }
          rightLabel={
            pages.isLast && actions.last?.label ? actions.last.label : "Next"
          }
          topLabel={actions.top && actions.top.label}
          bottomLabel={actions.bottom && actions.bottom.label}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.pan,
          {
            transform: [{ translateX: pan }],
          },
        ]}
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
          onMessage={onMessage}
        />

        <PageIndicator pages={pages} />
      </Animated.View>
    </View>
  );
}

function useStyles(windowWidth: number) {
  const { theme } = useThemeContext();
  const { sizes, colors } = theme;

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

  return { styles, theme };
}
