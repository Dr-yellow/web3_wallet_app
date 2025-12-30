import { CommonStyles } from "@/constants/theme/styles";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type PageProps = {
  children: React.ReactNode;
  title?: string;
  noHeader?: boolean;
} & ViewProps;

export function Page({
  children,
  noHeader = false,
  style,
  ...props
}: PageProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        { paddingTop: noHeader ? insets.top : 0 },
        CommonStyles.page,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
