import { useI18n } from "@/hooks/use-i-18n";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { TokenItem } from "@/api/wallet/token";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/Button";
import { grayScale } from "@/constants/theme/base";
import { useHome } from "@/context/HomeContext";
import { useColorFinance } from "@/hooks/use-color-finance";
import { formatDelimiter } from "@/utils/system/formatNumber";
import { useRouter } from "expo-router";

function CoinItem({ item, index }: { item: TokenItem; index: number }) {
  const isPositive = 1;
  const { up, down } = useColorFinance();
  const router = useRouter();
  const handlePress = (item: TokenItem) => {
    router.push({
      pathname: "/transfer/tranfer_token",
      // params: {
      //   balance: item.balance,
      //   logo_url: item.logo_url,
      //   symbol: item.symbol,
      //   total_value_usd: item.total_value_usd,
      //   unit_price_usd: item.unit_price_usd,
      //   chain: item.chain,
      // },
      params: {
        tokenItemInfo: JSON.stringify(item),
      },
    });
  };
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => handlePress(item)}>
      <Animated.View
        entering={FadeIn.delay(index * 50)}
        exiting={FadeOut}
        style={styles.itemContainer}
      >
        <ThemedView style={styles.leftContainer}>
          <Image source={{ uri: item.logo_url }} style={styles.icon} />

          <ThemedView style={styles.infoContainer}>
            <ThemedText style={styles.name}>{item.symbol}</ThemedText>
            <ThemedText style={styles.balanceText}>
              {formatDelimiter(item.balance ?? 0, { precision: 4 })}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.rightContainer}>
          <ThemedText style={styles.price}>
            {formatDelimiter(item.total_value_usd, {
              precision: 2,
              prefix: "$",
              suffix: "",
            })}
          </ThemedText>
          <ThemedText
            style={[styles.change, { color: isPositive ? up : down }]}
          >
            {isPositive ? "↑ " : "↓ "}
            {formatDelimiter(item.unit_price_usd, {
              precision: 2,
              prefix: "$",
              suffix: "",
            })}
          </ThemedText>
        </ThemedView>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function CoinList() {
  const { t } = useI18n();
  const { totalTokenList } = useHome();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <Button title={t("home.coins")} />
      </ThemedView>
      <ThemedView style={styles.listContent}>
        {totalTokenList.map((item, index) => (
          <CoinItem
            key={`${item.symbol}-${item.chains.join("-")}`}
            item={item}
            index={index}
          />
        ))}
      </ThemedView>
      <ThemedView style={{ height: 40 }} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 12,
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 28,
    backgroundColor: "transparent",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    width: 41,
    height: 41,
    borderRadius: 22,
    marginRight: 16,
  },
  infoContainer: {
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 6,
  },
  balanceText: {
    color: grayScale[200],
    fontSize: 15,
    fontWeight: 500,
  },
  rightContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  price: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 6,
  },
  change: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});
