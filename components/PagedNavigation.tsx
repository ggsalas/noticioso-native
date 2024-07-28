import { useThemeContext } from "@/theme/ThemeProvider";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  NativeScrollPoint,
  LayoutChangeEvent,
  LayoutRectangle,
} from "react-native";
import { PercentageBar } from "./PercentageBar";

type WithPadding = "fromContainer" | "fromRenderProp";
type PagedNavigationProps = {
  withPadding?: WithPadding;
  children: ReactNode | ((props: { padding: number }) => ReactNode);
};

export function PagedNavigation({
  children,
  withPadding,
}: PagedNavigationProps) {
  const { styles, padding } = useStyles(withPadding);
  const containerRef = useRef<ScrollView>(null);
  const containerSize = useRef<LayoutRectangle | undefined>(undefined);
  const [containerContentOffset, setContainerContentOffset] =
    useState<NativeScrollPoint>();
  const [contentSize, setContentSize] = useState<LayoutRectangle | undefined>();

  // To allow scroll a complete last page
  const [extraWhitespace, setExtraWhitespace] = useState(0);
  const hasAddedWhitespace = useRef(false);

  useEffect(() => {
    if (
      !hasAddedWhitespace.current &&
      containerSize.current &&
      contentSize?.height
    ) {
      const whitespace = containerSize.current.height - (contentSize.height % containerSize.current.height)
      setExtraWhitespace(Math.round(whitespace));
      hasAddedWhitespace.current = true;
    }
  }, [contentSize?.height]);

  const handleLayout = (event: LayoutChangeEvent) => {
    hasAddedWhitespace.current = false;
    containerSize.current = event.nativeEvent.layout;
  };

  const onContentLayout = (event: LayoutChangeEvent) => {
    setContentSize(event.nativeEvent.layout);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setContainerContentOffset(event.nativeEvent.contentOffset);
  };

  // const overlapSize = containerSize.current?.height
  //   ? containerSize.current?.height - fonts.lineHeightComfortable / 2
  //   : undefined;

  const readPercentage =
    containerContentOffset && containerSize.current && contentSize
      ? Math.round(
        ((containerContentOffset.y + containerSize.current.height) /
          contentSize.height) *
        100
      )
      : 0;

  return (
    <View>
      <PercentageBar percentage={readPercentage} />
      <ScrollView
        ref={containerRef}
        style={styles.container}
        onScroll={handleScroll}
        onLayout={handleLayout}
        scrollEnabled={true}
        pagingEnabled={true}
        // snapToInterval={overlapSize}
      >
        <View style={styles.content} onLayout={onContentLayout}>
          {typeof children === "function" ? children({ padding }) : children}
          <View style={{ height: extraWhitespace }} />
        </View>
      </ScrollView>
    </View>
  );
}

function useStyles(withPadding?: WithPadding) {
  const { theme } = useThemeContext();
  const { fonts } = theme;

  const padding = fonts.fontSizeP * 0.8;

  function widthOfParagraphChars(amount: number) {
    return (amount * fonts.fontSizeP) / 2.3 + padding * 2;
  }

  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "column",
    },
    content: {
      width: "100%",
      maxWidth: widthOfParagraphChars(60),
      marginHorizontal: "auto",
      paddingHorizontal: withPadding === "fromContainer" ? padding : 0,
    },
  });

  return { styles, padding, fonts };
}
