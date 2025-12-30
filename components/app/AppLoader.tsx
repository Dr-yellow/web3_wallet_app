import { Pressable, Text, View } from "react-native";

export function AppLoader({ children }: { children: React.ReactNode }) {
  const loading = false;
  const error = false;

  if (loading) {
    return (
      <View>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>出错了</Text>
        <Pressable
          onPress={() => {
            /* retry */
          }}
        >
          <Text>重试</Text>
        </Pressable>
      </View>
    );
  }

  return <>{children}</>;
}
