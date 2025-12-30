import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHome } from "@/context/HomeContext";
import { useColorFinance } from "@/hooks/use-color-finance";

const screenWidth = Dimensions.get("window").width;

export default function BalancePanel() {
  const marketTheme = useColorFinance();
  const { totalValue } = useHome();
  const [displayBalance] = useState(18050.09);
  const [change] = useState(-1180.9);
  const [percentage] = useState(-6.53);
  const [chartData] = useState<number[]>([
    18500, 18300, 18450, 18100, 18200, 18000, 18150, 17900, 18050, 18100, 18350,
    18200, 18050.09,
  ]);

  const formatBalance = (value: number) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.leftContent}>
        <MaskedView
          // style={styles.maskedView}
          maskElement={
            <ThemedText
              style={styles.balanceText}
              adjustsFontSizeToFit
              minimumFontScale={0}
            >
              {totalValue}
            </ThemedText>
          }
        >
          <LinearGradient
            colors={["#FFFFFF", "rgba(255, 255, 255, 0.23)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <ThemedText
              style={[styles.balanceText, { opacity: 0 }]}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              ${formatBalance(displayBalance)}
            </ThemedText>
          </LinearGradient>
        </MaskedView>
        <ThemedView style={styles.changeRow}>
          <ThemedText color={marketTheme.down} style={styles.changeText}>
            ↓ ${formatBalance(Math.abs(change))} ({percentage.toFixed(2)}%)
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.rightContent}>
        <LineChart
          data={{
            labels: [],
            datasets: [
              {
                data: chartData,
                color: (opacity = 1) => `rgba(255, 77, 77, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth * 0.4}
          height={80}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          chartConfig={{
            backgroundGradientFrom: "#000",
            backgroundGradientTo: "#000",
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => `rgba(255, 77, 77, ${opacity})`,
            strokeWidth: 2,
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
          }}
          bezier
          style={styles.chart}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 10,
  },
  leftContent: {
    flex: 1,
    justifyContent: "center",
  },
  balanceText: {
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  changeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  rightContent: {
    width: screenWidth * 0.4,
    alignItems: "flex-end",
  },
  chart: {
    paddingRight: 0,
    paddingLeft: 0,
    marginTop: 10,
  },
});
