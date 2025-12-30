import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="secure-wallet" options={{ headerShown: false }} />

      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="global_password"
        options={{
          title: "创建密码",
        }}
      />
      <Stack.Screen
        name="comfirm_password"
        options={{
          title: "确认密码",
        }}
      />
      <Stack.Screen
        name="AddAcountScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="import-wallet" options={{ headerShown: false }} />
      <Stack.Screen name="name-wallet" options={{ headerShown: false }} />
      <Stack.Screen name="confirm-phrase" options={{ headerShown: false }} />
      <Stack.Screen name="selletAccount" options={{ headerShown: false }} />
      <Stack.Screen name="high-setting" options={{ headerShown: false }} />
      <Stack.Screen name="import-privaty" options={{ headerShown: false }} />
      <Stack.Screen name="select-network" options={{ headerShown: false }} />
    </Stack>
  );
}
