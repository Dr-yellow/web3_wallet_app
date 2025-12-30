import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "transparentModal",
        contentStyle: { backgroundColor: "transparent" },
        animation: "fade",
      }}
    />
  );
}
