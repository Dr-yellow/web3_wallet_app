import { router } from "expo-router";

export type GuideItem = {
  id: string;
  title: string;
  description: string;
  buttonTitle: string;
  footer?: string;
  image: any;
  onPress: (close: () => void) => void;
};

export const GUIDES: GuideItem[] = [
  {
    id: "login",
    title: "登录GM Wallet",
    description:
      "登录GM Wallet即可体验更便捷流畅的链上交易体验。GM Wallet通过将Gas fee包含在欲交易转账的代币中，做到无缝交易*的体验，无需额外购置燃气币，提高交易速度与便捷性，助您轻松参与区块链交易。",
    buttonTitle: "登录/注册",
    footer: "*当前支持的网络包括：EVM, Solana及Tron。",
    image: require("@/assets/images/guide2.png"),
    onPress: (close) => {
      close();
      router.push("/login/mail")
    }
  },
  {
    id: "security",
    title: "保护您的账户",
    description:
      "保护自托管Web3钱包的安全性至关重要，请定期备份您的钱包私钥及助记词，并将其存储在安全的地方，尽量避免在线存储。使用硬件钱包可以提供更高的安全性，尤其是在处理大量加密资产时。保持软件和设备的更新，防止潜在的安全漏洞。警惕钓鱼攻击，不要随意点击非官方网站及交互合约。",
    buttonTitle: "好的",
    image: require("@/assets/images/guide1.png"),
    onPress: (close) => close()
  },
];
