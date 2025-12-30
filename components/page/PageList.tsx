import { FlatList, FlatListProps } from "react-native";
import { Page } from "./Page";

export function PageList<T>({
  onRefresh,
  refreshing,
  ...props
}: FlatListProps<T> & {
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  return (
    <Page>
      <FlatList {...props} onRefresh={onRefresh} refreshing={refreshing} />
    </Page>
  );
}
