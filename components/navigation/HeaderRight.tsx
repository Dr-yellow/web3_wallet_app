import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type HeaderRightProps = {
  title?: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function HeaderRight({
  title,
  onPress,
  loading = false,
  disabled = false,
}: HeaderRightProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.container,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[styles.text, disabled && styles.disabled]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    color: "#fff",
    fontSize: 15,
  },
  disabled: {
    opacity: 0.4,
  },
});
