import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { useDebouncedNavigation } from "@/hooks/use-debounced-navigation";
import { encryptMnemonic } from "@/utils/wallet/crypto-help";
import { setCurrentWallet } from "@/utils/wallet/wallet-storage";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface WordPosition {
  position: number;
  word: string;
  options: string[];
}
const positions = [2, 4, 6, 11]; // Word #3, #5, #7, #12 (0-indexed + 1)

export default function ConfirmPhraseScreen() {
  const router = useDebouncedNavigation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    mnemonic?: string;
    walletName?: string;
    avatar?: string;
  }>();
  const [selectedWords, setSelectedWords] = useState<{ [key: number]: string }>(
    {}
  );
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Parse mnemonic from params
    const mnemonicString = params.mnemonic as string;
    if (mnemonicString) {
      const words = mnemonicString.split(" ");

      // Select 4 random positions to verify
      const verificationWords: WordPosition[] = positions.map((pos) => {
        const correctWord = words[pos];
        // Generate fake options
        const fakeWords = [
          "galaxy",
          "wave",
          "stardust",
          "whisper",
          "nebula",
          "resonance",
          "comet",
          "current",
          "flow",
          "zenith",
        ].filter((w) => w !== correctWord);

        // Shuffle options
        const options = [correctWord, fakeWords[0], fakeWords[1]].sort(
          () => Math.random() - 0.5
        );

        return {
          position: pos + 1, // 1-indexed for display
          word: correctWord,
          options: options,
        };
      });
      console.log("verificationWords", verificationWords);
      setWordPositions(verificationWords);
    }
  }, [params.mnemonic]);

  const handleWordSelect = (position: number, word: string) => {
    setSelectedWords((prev) => ({
      ...prev,
      [position]: word,
    }));
  };

  const isAllSelected = () => {
    return wordPositions.every(
      (wp) => selectedWords[wp.position] !== undefined
    );
  };

  const isCorrect = () => {
    return wordPositions.every((wp) => selectedWords[wp.position] === wp.word);
  };

  const handleNext = useCallback(async () => {
    if (!isAllSelected()) {
      Alert.alert("请选择所有单词", "请确保所有单词都已选择", [{ text: "OK" }]);
      return;
    }

    if (!isCorrect()) {
      Alert.alert("单词错误", "请确保所有单词都已选择", [{ text: "OK" }]);
      // Reset selections for incorrect words
      const newSelections = { ...selectedWords };
      wordPositions.forEach((wp) => {
        if (selectedWords[wp.position] !== wp.word) {
          delete newSelections[wp.position];
        }
      });
      setSelectedWords(newSelections);
      return;
    }
    console.log("selectedWords", selectedWords);

    setIsCreating(true);
    try {
      const walletId = `wallet_${Date.now()}`;

      const { encryptedData, salt } = await encryptMnemonic(
        params?.mnemonic as string,
        walletId
      );

      await setCurrentWallet(walletId, encryptedData, salt);

      Alert.alert("成功", "钱包创建成功！", [
        {
          text: "确定",
          onPress: () => {
            router.replace({
              pathname: "/wallet-setup/selletAccount",
            });
          },
        },
      ]);
      setIsCreating(false);
    } catch (error: any) {
      console.error("[VerifyMnemonicScreen] Error creating wallet:", error);
      Alert.alert("错误", `创建钱包失败: ${error?.message || error}`);
    } finally {
      setIsCreating(false);
    }
  }, [params.mnemonic]);

  const getButtonStyle = (position: number, word: string) => {
    const selected = selectedWords[position] === word;
    const isCorrectWord =
      wordPositions.find((wp) => wp.position === position)?.word === word;

    if (selected) {
      if (isAllSelected() && !isCorrect() && !isCorrectWord) {
        return [styles.wordOption, styles.wordOptionIncorrect];
      }
      return [styles.wordOption, styles.wordOptionSelected];
    }

    return styles.wordOption;
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "验证助记词",
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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>请确认您的助记词</Text>

        {wordPositions.map((wp) => (
          <View key={wp.position} style={styles.wordSection}>
            <Text style={styles.wordLabel}>单词 #{wp.position}</Text>
            <View style={styles.optionsContainer}>
              {wp.options.map((option) => (
                <TouchableOpacity
                  key={`${wp.position}-${option}`}
                  style={getButtonStyle(wp.position, option)}
                  onPress={() => handleWordSelect(wp.position, option)}
                >
                  <Text
                    style={[
                      styles.wordOptionText,
                      selectedWords[wp.position] === option &&
                        styles.wordOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        {/* <TouchableOpacity
          style={[
            styles.nextButton,
            !isAllSelected() && styles.nextButtonDisabled,
            isCreating && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
        >
          <Text
            style={[
              styles.nextButtonText,
              !isAllSelected() && styles.nextButtonTextDisabled,
            ]}
          >
            {isCreating ? "Creating..." : "Next"}
          </Text>
        </TouchableOpacity> */}
        <Button
          size="lg"
          title={isCreating ? "创建中…" : "下一步"}
          onPress={handleNext}
          disabled={!isAllSelected() || isCreating}
        ></Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: colors.primary,
    fontSize: 16,
    marginLeft: 4,
  },
  skipText: {
    color: colors.primary,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 32,
  },
  wordSection: {
    marginBottom: 28,
  },
  wordLabel: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    marginHorizontal: -6,
  },
  wordOption: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  wordOptionSelected: {
    backgroundColor: "rgba(30, 144, 255, 0.1)",
    borderColor: "#5EEAD4",
  },
  wordOptionIncorrect: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderColor: colors.danger,
  },
  wordOptionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  wordOptionTextSelected: {
    color: "#fff",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  nextButton: {
    backgroundColor: "#fff",
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonDisabled: {
    backgroundColor: colors.card,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  nextButtonTextDisabled: {
    color: colors.textTertiary,
  },
  headerIcon: {
    paddingHorizontal: 8,
  },
});
