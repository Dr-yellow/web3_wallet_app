import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen
        name="tranfer_token"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />

      <Stack.Screen
        name="tron"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />

      <Stack.Screen
        name="send_token"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="transfer_pendding"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="send_success"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
    </Stack>
  );
}
