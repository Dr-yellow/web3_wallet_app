import { RefreshControl, ScrollView, ScrollViewProps } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import type { PageProps as PagePropsType } from "./Page";
import { Page } from "./Page";

export function PageScroll({
  children,
  onRefresh,
  refreshing = false,
  contentContainerStyle,
  ...pageProps
}: {
  children: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
} & PagePropsType &
  ScrollViewProps) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <Page {...pageProps}>
      <ScrollView
        ref={scrollRef as any}
        contentContainerStyle={contentContainerStyle}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        {...pageProps}
      >
        {children}
      </ScrollView>
    </Page>
  );
}
