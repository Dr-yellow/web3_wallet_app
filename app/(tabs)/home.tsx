import { StyleSheet } from "react-native";

import ActionButtons from "@/components/home/ActionButtons";
import BalancePanel from "@/components/home/BalancePanel";
import CoinList from "@/components/home/CoinList";
import GuidePanel from "@/components/home/GuidePanel";
import Header from "@/components/home/Header";
import { PageScroll } from "@/components/page/PageScroll";
import { useState } from "react";
export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const reload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  return (
    <PageScroll noHeader onRefresh={reload} refreshing={loading}>
      <Header />
      <BalancePanel />
      <ActionButtons />
      <GuidePanel />
      <CoinList />
    </PageScroll>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
