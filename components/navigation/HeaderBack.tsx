import { router } from "expo-router";
import { Pressable, Text } from "react-native";

export function HeaderBack() {
  return (
    <Pressable onPress={() => router.back()}>
      <Text style={{ color: "#fff" }}>返回</Text>
    </Pressable>
  );
}
