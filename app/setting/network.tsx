import {
  NetworkItem,
  NetworkList,
} from "@/components/setting/network/NetworkList";
import { NetworkTabId } from "@/components/setting/network/types";
import { NodeItemData } from "@/components/setting/node/NodeItem";
import { ThemedText } from "@/components/themed-text";
import { FixedBottomButton } from "@/components/ui/FixedBottomButton";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Switch from "@/components/ui/Switch";
import { PrimaryTabs } from "@/components/ui/tabs/PrimaryTabs";
import { SecondaryTabs } from "@/components/ui/tabs/SecondaryTabs";
import Touch from "@/components/ui/Touch";
import { grayScale } from "@/constants/theme/base";
import { CommonStyles } from "@/constants/theme/styles";
import { useI18n } from "@/hooks/use-i-18n";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const MOCK_NETWORKS: NetworkItem[] = [
  { id: "bnb", name: "BNB Chain", rpcUrl: "bsc-dataseed3.defibit.io" },
  { id: "btc", name: "Bitcoin", rpcUrl: "unissat.io" },
  { id: "eth", name: "Ethereum", rpcUrl: "web3.mybitkeep.io" },
  { id: "sol", name: "Solana", rpcUrl: "web3.mybitkeep.io" },
  { id: "base", name: "Base", rpcUrl: "web3.mybitkeep.io" },
  { id: "tron", name: "Tron", rpcUrl: "web3.mybitkeep.io" },
];

const INITIAL_ROUTES: NodeItemData[] = Array.from({ length: 8 }, (_, i) => ({
  id: `${i + 1}`,
  name: `线路 ${i + 1}`,
  url: "",
  latency: Math.floor(Math.random() * 150) + 250,
  isSelected: i === 7,
}));

export default function NetworkManagementScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const [activePrimary, setActivePrimary] = useState<NetworkTabId>(
    NetworkTabId.Line
  );
  const [activeSecondary, setActiveSecondary] = useState("default");
  const [autoSelect, setAutoSelect] = useState(true);
  const [routes, setRoutes] = useState<NodeItemData[]>(INITIAL_ROUTES);

  const translatedTabs = useMemo(
    () => [
      {
        id: NetworkTabId.Line,
        label: t("network.line_management"),
        children: [
          { id: "default", label: t("common.default") },
          { id: "smart", label: t("network.smart_line") },
        ],
      },
      {
        id: NetworkTabId.Rpc,
        label: t("network.rpc_management"),
        children: [
          { id: "default", label: t("common.default") },
          { id: "custom", label: t("common.custom") },
        ],
      },
    ],
    [t]
  );

  const secondaryTabs = useMemo(() => {
    const tab = translatedTabs.find((tab) => tab.id === activePrimary);
    return tab?.children || [];
  }, [activePrimary, translatedTabs]);

  const handlePressItem = (item: NetworkItem) => {
    router.push({
      pathname: "/setting/nodes/[id]",
      params: { id: item.id, name: item.name },
    });
  };

  const handleAddEvmNetwork = () => {
    router.push("/setting/add-evm-network");
  };

  const handleSelectRoute = (selectedRoute: NodeItemData) => {
    setRoutes((prev) =>
      prev.map((route) => ({
        ...route,
        isSelected: route.id === selectedRoute.id,
      }))
    );
    setAutoSelect(false);
  };

  useEffect(() => {
    if (autoSelect) {
      setRoutes((prev) =>
        prev.map((route, index) => ({
          ...route,
          isSelected: index === 0,
        }))
      );
    }
  }, [autoSelect]);

  const selectedRoute = routes.find((r) => r.isSelected);

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Stack.Screen
        options={{
          title: t("network.title"),
          headerBackTitle: "",
        }}
      />

      <PrimaryTabs
        tabs={translatedTabs}
        activeTab={activePrimary}
        onTabChange={(id) => setActivePrimary(id as NetworkTabId)}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {activePrimary === NetworkTabId.Line ? (
          <View>
            <View style={styles.autoSelectContainer}>
              <View style={styles.autoSelectRow}>
                <ThemedText style={styles.autoSelectTitle}>
                  {t("network.auto_select")}
                </ThemedText>
                <ThemedText style={styles.currentRouteInfo}>
                  {t("network.current_line")}
                  <ThemedText style={{ color: "#fff" }}>
                    {selectedRoute?.name} ({selectedRoute?.latency}ms)
                  </ThemedText>
                </ThemedText>
              </View>
              <Switch value={autoSelect} onValueChange={setAutoSelect} />
            </View>

            <View style={styles.divider} />

            {routes.map((route) => (
              <Touch
                key={route.id}
                style={[
                  styles.routeItem,
                  route.isSelected && styles.selectedRouteItem,
                ]}
                activeOpacity={0.7}
                onPress={() => handleSelectRoute(route)}
              >
                <ThemedText style={styles.routeName}>{route.name}</ThemedText>
                <ThemedText style={styles.routeLatency}>
                  ({route.latency}ms)
                </ThemedText>
              </Touch>
            ))}

            <View style={styles.tipContainer}>
              <IconSymbol name="info.circle" size={14} color={grayScale[100]} />
              <ThemedText style={styles.tipText}>
                选择自动，系统会周期性自动选择最优线路，数值越小代表网络状况越好
              </ThemedText>
            </View>
          </View>
        ) : (
          <>
            <SecondaryTabs
              tabs={secondaryTabs}
              activeTab={activeSecondary}
              onTabChange={setActiveSecondary}
            />
            <NetworkList items={MOCK_NETWORKS} onPressItem={handlePressItem} />
          </>
        )}
      </ScrollView>

      {activePrimary === NetworkTabId.Rpc && (
        <FixedBottomButton
          title={t("network.add_evm")}
          onPress={handleAddEvmNetwork}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  autoSelectContainer: {
    padding: 24,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedRouteItem: {
    ...CommonStyles.activeBg,
    borderRadius: 36,
    paddingHorizontal: 16,
  },
  routeItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    flexDirection: "row",
    color: "#000",
  },
  routeName: {
    color: grayScale[200],
  },
  routeLatency: {
    fontSize: 14,
    color: grayScale[200],
  },
  autoSelectRow: {
    marginBottom: 8,
  },
  autoSelectTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  currentRouteInfo: {
    fontSize: 14,
    color: grayScale[200],
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 24,
    marginBottom: 10,
  },
  tipContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 24,
    paddingBottom: 20,
  },
  tipText: {
    fontSize: 15,
    color: grayScale[200],
    marginLeft: 8,
    marginTop: -2,
    lineHeight: 18,
    flex: 1,
  },
});
