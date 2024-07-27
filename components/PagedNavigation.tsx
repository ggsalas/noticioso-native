import { useThemeContext } from "@/theme/ThemeProvider";
import { ReactNode, useRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  GestureResponderEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  NativeScrollPoint,
  LayoutChangeEvent,
  LayoutRectangle,
} from "react-native";

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
  const startY = useRef(0);
  const containerSize = useRef<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const containerContentOffset = useRef<NativeScrollPoint>({ x: 0, y: 0 });

  const handleLayout = (event: LayoutChangeEvent) => {
    containerSize.current = event.nativeEvent.layout;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    containerContentOffset.current = event.nativeEvent.contentOffset;
  };

  const handleOnTouchStart = (event: GestureResponderEvent) => {
    startY.current = event.nativeEvent.pageY;
  };

  const handleOnTouchEnd = (event: GestureResponderEvent) => {
    const endY = event.nativeEvent.pageY;

    const getY = () => {
      if (!containerSize.current || !containerContentOffset?.current) return 0;

      // Scroll Down
      if (endY < startY.current) {
        return containerContentOffset.current?.y + containerSize.current.height;
      }

      // Scroll Up
      if (endY > startY.current) {
        return containerContentOffset.current?.y - containerSize.current.height;
      }
    };

    containerRef.current?.scrollTo({
      y: getY(),
      animated: true,
    });
  };

  return (
    <ScrollView
      ref={containerRef}
      style={styles.container}
      onScroll={handleScroll}
      onTouchStart={handleOnTouchStart}
      onTouchEnd={handleOnTouchEnd}
      onLayout={handleLayout}
      scrollEnabled={false}
    >
      <View style={styles.content}>
        {typeof children === "function" ? children({ padding }) : children}
      </View>
    </ScrollView>
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

  return { styles, padding };
}
