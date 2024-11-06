import { useThemeContext } from "@/theme/ThemeProvider";
import { useMemo, useRef, useState } from "react";
import { StyleSheet, Dimensions, Animated, View, Text } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import {
  getHorizontalNavigationPage,
  script,
} from "../../lib/horizontalNavigation";
import { Labels } from "./Labels";
import { usePanResponder } from "./usePanResponder";
import {
  HTMLPagesNavActions,
  HandleLinkData,
  HandleRouterLinkData,
  Pages,
} from "@/types";
import { PageIndicator } from "./PageIndicator";

type HTMLPaesNavProps = {
  html: string;
  actions: HTMLPagesNavActions;
  handleLink?: (data: HandleLinkData) => void;
  handleRouterLink?: (data: HandleRouterLinkData) => void;
};

export function HTMLPagesNav({
  html,
  actions,
  handleLink,
  handleRouterLink,
}: HTMLPaesNavProps) {
  const webviewRef = useRef(null);
  const { width, height } = Dimensions.get("window");
  const { styles, theme } = useStyles(width);
  const [pages, setPages] = useState<Pages>({
    isFirst: true,
  } as unknown as Pages);
  const { panResponder, pan, labelsOpacity, opacity } = usePanResponder({
    width,
    height,
    webviewRef,
  });

  const content = useMemo(
    () =>
      getHorizontalNavigationPage({
        content: html,
        width: styles.webView.width,
        theme,
        pageNumber: pages.current,
      }),
    [html, styles.webView.width, theme, pages.current]
  );

  // Receives messages from JS inside page content
  const onMessage = (event: WebViewMessageEvent) => {
    const stringifyData = event.nativeEvent.data;
    const { eventName, ...data } = JSON.parse(stringifyData) ?? {};

    const handlePages = () => {
      const { viewportWidth, articleWidth, scrollLeft } = data;

      setPages(() => {
        const getUpdatedScrollLeft = (): number => {
          if (eventName === "SWIPE_NEXT") {
            // Prevent overflow at end
            if (!(articleWidth <= scrollLeft + viewportWidth)) {
              return scrollLeft + viewportWidth;
            }
          } else if (eventName === "SWIPE_PREVIOUS") {
            // Prevent overflow at start
            if (scrollLeft != 0) {
              return scrollLeft - viewportWidth;
            }
          }

          return scrollLeft;
        };

        const newScrollLeft = getUpdatedScrollLeft();
        const amount = Math.ceil(articleWidth / viewportWidth);
        const current = newScrollLeft / viewportWidth + 1;
        const isFirst = newScrollLeft == 0;
        const isLast = amount == current;

        return {
          amount,
          current,
          isFirst,
          isLast,
        };
      });
    };

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
      case "ON_LOAD":
        return handlePages();
      case "HANDLE_LINK":
        return handleLink && handleLink(data);
      case "HANDLE_ROUTER_LINK":
        return handleRouterLink && handleRouterLink(data);
      default:
        return;
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
            transform: pan.getTranslateTransform(),
            opacity,
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
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          scalesPageToFit={false}
          onMessage={onMessage}
          injectedJavaScript={script}
        />

        <PageIndicator pages={pages} />
      </Animated.View>
    </View>
  );
}

function useStyles(windowWidth: number) {
  const { theme } = useThemeContext();
  const { sizes, colors } = theme;

  const webViewWidth = () => {
    const screenWidth = windowWidth - sizes.s1 * 2;
    const maxWidth = sizes.s1 * 30;

    return Math.min(screenWidth, maxWidth);
  };

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
      elevation: 1,
      flexDirection: "column",
      alignItems: "center",
    },
    webView: {
      width: webViewWidth(),
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
