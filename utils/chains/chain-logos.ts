/**
 * 链 Logo 配置
 * 为每个链提供 logo 图标名称和背景颜色
 */
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export interface ChainLogoConfig {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  backgroundColor: string;
}

/**
 * 根据链 ID 获取 logo 配置
 */
export function getChainLogo(
  chainId: string,
  chainName: string
): ChainLogoConfig {
  const id = chainId.toUpperCase();
  const name = chainName.toUpperCase();

  // Solana - 优先判断（因为 MAINNET/DEVNET 可能与其他链冲突）
  if (
    name.includes("SOLANA") ||
    (id === "MAINNET" && name.includes("SOL")) ||
    (id === "DEVNET" && name.includes("SOL"))
  ) {
    // Solana Devnet 使用 outline 图标
    if (id === "DEVNET" || name.includes("DEVNET")) {
      return {
        icon: "flash-outline",
        iconColor: "#14F195",
        backgroundColor: "#1a1a1a",
      };
    }
    // Solana Mainnet 使用实心图标
    return {
      icon: "flash",
      iconColor: "#14F195",
      backgroundColor: "#1a1a1a",
    };
  }

  // 比特币
  if (
    id.includes("BITCOIN") ||
    name.includes("BITCOIN") ||
    name.includes("BTC")
  ) {
    return {
      icon: "currency-btc",
      iconColor: "#F7931A",
      backgroundColor: "#1a1a1a",
    };
  }

  // 以太坊
  if (
    id.includes("ETHEREUM") ||
    name.includes("ETHEREUM") ||
    (name.includes("ETH") && !name.includes("TESTNET"))
  ) {
    return {
      icon: "ethereum",
      iconColor: "#627EEA",
      backgroundColor: "#1a1a1a",
    };
  }

  // Sepolia (测试网)
  if (id.includes("SEPOLIA") || name.includes("SEPOLIA")) {
    return {
      icon: "ethereum",
      iconColor: "#627EEA",
      backgroundColor: "#1a1a1a",
    };
  }

  // 币安智能链
  if (
    id.includes("BSC") ||
    id.includes("BINANCE") ||
    name.includes("BINANCE") ||
    name.includes("BSC")
  ) {
    return {
      icon: "hexagon-multiple",
      iconColor: "#F3BA2F",
      backgroundColor: "#1a1a1a",
    };
  }

  // 波场 (Tron)
  if (id.includes("TRON") || name.includes("TRON") || name.includes("TRX")) {
    return {
      icon: "triangle",
      iconColor: "#FF0012",
      backgroundColor: "#1a1a1a",
    };
  }

  // Polygon
  if (
    id.includes("POLYGON") ||
    name.includes("POLYGON") ||
    name.includes("MATIC")
  ) {
    return {
      icon: "hexagon-slice-6",
      iconColor: "#8247E5",
      backgroundColor: "#1a1a1a",
    };
  }

  // 默认配置
  return {
    icon: "wallet",
    iconColor: "#9E9E9E",
    backgroundColor: "#1a1a1a",
  };
}
