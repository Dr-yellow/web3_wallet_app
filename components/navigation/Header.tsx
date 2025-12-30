import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBack } from "./HeaderBack";
import { useNav } from "./NavContext";

export function Header() {
  const NavConfig = useNav();
  const config = NavConfig?.config;
  const insets = useSafeAreaInsets();

  if (!config) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.left}>{config.showBack && <HeaderBack />}</View>

      <View style={styles.center}>
        <Text style={styles.title}>{config.title}</Text>
      </View>

      <View style={styles.right}>{config.right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
  },
  left: { width: 60, alignItems: "center" },
  center: { flex: 1, alignItems: "center" },
  right: { width: 60, alignItems: "center" },
  title: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
