import { Stack } from "expo-router";

export default function WalletManagerLayout() {
  return (
    <Stack>
      <Stack.Screen name="wallet-list" options={{ headerShown: false }} />
    </Stack>
  );
}
