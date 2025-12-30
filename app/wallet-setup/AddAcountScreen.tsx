import { ThemedView } from "@/components/themed-view";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface OptionCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  icon,
  title,
  description,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.optionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionIconContainer}>
        <MaterialCommunityIcons name={icon as any} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function AddAcountScreen() {
  const router = useDebouncedNavigation();
  const insets = useSafeAreaInsets();

  const handleImportMnemonic = () => {
    router.push("/wallet-setup/import-wallet");
  };

  const handleImportPrivateKey = () => {
    router.push("/wallet-setup/import-privaty");
  };

  const handleImportCloudBackup = () => {
    // 导入云端备份功能，暂时显示提示
    Alert.alert("提示", "导入云端备份功能开发中");
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "添加账户",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#000",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerIcon}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      {/* 选项卡片列表 */}
      <View style={styles.optionsContainer}>
        <OptionCard
          icon="cloud-outline"
          title="导入云端备份钱包"
          description="通过iCloud导入助记词"
          onPress={handleImportCloudBackup}
        />
        <OptionCard
          icon="file-document-outline"
          title="导入助记词钱包"
          description="导入BIP-39标准的多链钱包"
          onPress={handleImportMnemonic}
        />

        <OptionCard
          icon="download-outline"
          title="导入私钥"
          description="导入单链账户"
          onPress={handleImportPrivateKey}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  optionsContainer: {
    gap: 36,
    paddingHorizontal: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 0,
  },
  optionIconContainer: {
    width: 41,
    height: 41,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 17,
  },
  optionContent: {
    flex: 1,
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 18,
    letterSpacing: -0.07,
  },
  optionDescription: {
    fontSize: 15,
    fontWeight: "400",
    color: "#999999",
    letterSpacing: -0.07,
  },
  chevronContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    paddingHorizontal: 8,
  },
});
