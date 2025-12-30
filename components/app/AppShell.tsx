import { View } from "react-native";
import { AppGuard } from "./AppGuard";
import { AppLoader } from "./AppLoader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppGuard>
      <AppLoader>
        <View style={{ flex: 1 }}>{children}</View>
      </AppLoader>
    </AppGuard>
  );
}
