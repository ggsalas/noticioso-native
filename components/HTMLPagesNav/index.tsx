import { useThemeContext } from "@/theme/ThemeProvider";
import { memo, useCallback, useRef, useState } from "react";
import { StyleSheet, Dimensions, Animated, View } from "react-native";
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
import { getWebViewEvents } from "./webViewEvents";
import { useFocusEffect } from "expo-router";

type HTMLPaesNavProps = {
  name: string;
  html: string;
  actions: HTMLPagesNavActions;
  handleLink?: (data: HandleLinkData) => void;
  handleRouterLink?: (data: HandleRouterLinkData) => void;
};

export function HTMLPagesNavComponent({
  name,
  html,
  actions,
  handleLink,
  handleRouterLink,
}: HTMLPaesNavProps) {
  const webviewRef = useRef<WebView>(null);
  const { width, height } = Dimensions.get("window");
  const { styles, theme } = useStyles(width);
  const [pages, setPages] = useState<Pages>({
    scrollLeft: 0,
    isFirst: true,
    isLast: false,
  } as unknown as Pages);
  const { panResponder, pan, labelsOpacity, opacity } = usePanResponder({
    name,
    width,
    height,
    webviewRef,
  });

  const content = getHorizontalNavigationPage({
    content: html,
    width: styles.webView.width,
    theme,
  });

  const webViewEvents = getWebViewEvents(name);
  const {
    SWIPE_NEXT,
    SWIPE_PREVIOUS,
    SWIPE_TOP,
    SWIPE_BOTTOM,
    ON_LOAD,
    HANDLE_LINK,
    HANDLE_ROUTER_LINK,
    _CONSOLE_,
  } = webViewEvents;

  const handleScroll = useCallback((scrollLeft: number) => {
    webviewRef.current?.injectJavaScript(`
      document.getElementById("viewport").scrollLeft = ${scrollLeft};
      true;
    `);
  }, []);

  useFocusEffect(() => handleScroll(pages.scrollLeft));

  // Receives messages from JS inside page content
  const onMessage = (event: WebViewMessageEvent) => {
    const stringifyData = event.nativeEvent.data;
    const { eventName, ...data } = JSON.parse(stringifyData) ?? {};

    const handlePages = () => {
      const { viewportWidth, articleWidth } = data;
      const { scrollLeft } = pages;

      const getUpdatedScrollLeft = (): number => {
        if (eventName === SWIPE_NEXT) {
          // Prevent overflow at end
          if (!(articleWidth <= scrollLeft + viewportWidth)) {
            return scrollLeft + viewportWidth;
          }
        } else if (eventName === SWIPE_PREVIOUS) {
          // Prevent overflow at start
          if (scrollLeft != 0) {
            return scrollLeft - viewportWidth;
          }
        }

        return pages.scrollLeft;
      };

      const updatedScrollLeft = getUpdatedScrollLeft();

      setPages(() => {
        const amount = Math.ceil(articleWidth / viewportWidth);
        const current = updatedScrollLeft / viewportWidth + 1;
        const isFirst = updatedScrollLeft == 0;
        const isLast = amount == current;

        return {
          amount,
          current,
          scrollLeft: updatedScrollLeft,
          isFirst,
          isLast,
        };
      });

      handleScroll(updatedScrollLeft);
    };

    switch (eventName) {
      case SWIPE_NEXT:
        if (pages.isLast) {
          return actions.last.action();
        } else {
          handlePages();
          return;
        }
      case SWIPE_PREVIOUS:
        if (pages.isFirst) {
          return actions.first.action();
        } else {
          handlePages();
          return;
        }
      case SWIPE_TOP:
        return actions.top && actions.top.action();
      case SWIPE_BOTTOM:
        return actions.bottom && actions.bottom.action();
      case ON_LOAD: {
        return handlePages();
      }
      case HANDLE_LINK:
        return handleLink && handleLink(data);
      case HANDLE_ROUTER_LINK:
        return handleRouterLink && handleRouterLink(data);
      case _CONSOLE_:
        return console.log(data);
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
          style={[styles.webView, { opacity: pages.amount > 0 ? 1 : 0 }]}
          originWhitelist={["*"]}
          source={{ html: content }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          scalesPageToFit={false}
          onMessage={onMessage}
          injectedJavaScript={script(webViewEvents)}
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

export const HTMLPagesNav = memo((props: HTMLPaesNavProps) => (
  <HTMLPagesNavComponent {...props} />
));
