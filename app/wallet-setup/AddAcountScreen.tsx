import { Page } from "@/components/page/Page";
import { ThemedText } from "@/components/themed-text";
import Touch from "@/components/ui/Touch";
import { grayScale } from "@/constants/theme/base";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
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
    <Touch style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionIconContainer}>
        <MaterialCommunityIcons name={icon as any} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.optionContent}>
        <ThemedText style={styles.optionTitle}>{title}</ThemedText>
        <ThemedText style={styles.optionDescription}>{description}</ThemedText>
      </View>
    </Touch>
  );
};

export default function AddAcountScreen() {
  const router = useDebouncedNavigation();

  const handleImportMnemonic = () => {
    router.push("/wallet-setup/import-wallet");
  };

  const handleImportPrivateKey = () => {
    router.push("/wallet-setup/import-privaty");
  };

  const handleImportCloudBackup = () => {
    Alert.alert("提示", "导入云端备份功能开发中");
  };

  return (
    <Page>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "添加账户",
          // headerTitleAlign: "center",
          // headerTintColor: "#fff",
          // headerShadowVisible: false,
          // headerStyle: {
          //   backgroundColor: "#000",
          // },
          // headerLeft: () => (
          //   <TouchableOpacity
          //     onPress={() => router.back()}
          //     style={styles.headerIcon}
          //   >
          //     <Ionicons name="chevron-back" size={28} color="#fff" />
          //   </TouchableOpacity>
          // ),
        }}
      />
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
    </Page>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
    gap: 32,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: grayScale[300],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: grayScale[200],
  },
  headerIcon: {
    marginLeft: -8,
  },
});
