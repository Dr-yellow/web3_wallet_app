import { grayScale, greenScale, redScale } from "@/constants/theme/base";
import { Theme, darkTheme } from "@tetherto/wdk-uikit-react-native";

export const appWdkTheme: Theme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    background: "#000000",
    surface: grayScale[400],
    text: grayScale[100],
    textSecondary: grayScale[200],
    border: "rgba(255, 255, 255, 0.1)",
    success: greenScale[100],
    error: redScale[100],
    primary: grayScale[100],
    primaryDark: grayScale[200],
    primaryLight: grayScale[100],
  },
  componentOverrides: {
    TransactionItem: {
      container: {
        backgroundColor: "transparent",
        paddingVertical: 18,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.05)",
      },
      title: {
        fontSize: 15,
        fontWeight: "500",
        color: grayScale[100],
      },
      subtitle: {
        fontSize: 14,
        color: grayScale[200],
        marginTop: 4,
      },
      amount: {
        fontSize: 16,
        fontWeight: "600",
        color: grayScale[100],
      },
      icon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 12,
        backgroundColor: grayScale[300],
      }
    },
    TransactionList: {
      container: {
        backgroundColor: "transparent",
      }
    }
  },
};
