import { grayScale } from "@/constants/theme/base";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface SeedPhraseProps {
  words: string[];
  editable?: boolean;
  onWordChange?: (index: number, word: string) => void;
  onKeyPress?: (index: number, key: string) => void;
  isLoading?: boolean;
  hidden?: boolean;
}

export function SeedPhrase({
  words,
  editable = false,
  onWordChange,
  onKeyPress,
  isLoading = false,
  hidden = false,
}: SeedPhraseProps) {
  const inputRefs = useRef<(React.ElementRef<typeof TextInput> | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleWordChange = (index: number, text: string) => {
    if (!editable || !onWordChange) return;

    onWordChange(index, text);
  };

  const handleKeyPress = (index: number, key: string) => {
    if (!editable) return;

    if (onKeyPress) {
      onKeyPress(index, key);
    } else {
      // Handle backspace to go to previous input
      if (key === "Backspace" && !words[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Generating secure seed phrase...
          </Text>
        </View>
      </View>
    );
  }

  const getDisplayWord = (word: string) => {
    if (!hidden || !word) return word;
    return "••••••";
  };

  return (
    <View style={styles.container}>
      {words.map((word, index) => (
        <View
          key={index}
          style={[
            styles.wordItem,
            focusedIndex === index && styles.wordItemFocused,
          ]}
        >
          <Text style={styles.wordNumber}>
            {index < 9 ? "0" : ""}
            {index + 1}
          </Text>
          {editable ? (
            <TextInput
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={styles.wordInput}
              value={word}
              onChangeText={(text) => handleWordChange(index, text)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(index, nativeEvent.key)
              }
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              placeholder=""
              placeholderTextColor={"#666"}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              textContentType="none"
              secureTextEntry={hidden}
              returnKeyType={index === words.length - 1 ? "done" : "next"}
              onSubmitEditing={() => {
                if (index < words.length - 1) {
                  inputRefs.current[index + 1]?.focus();
                }
              }}
            />
          ) : (
            <Text style={styles.wordText}>{getDisplayWord(word)}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 20,
  },
  wordItem: {
    width: "29.33%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: grayScale[300],
    borderRadius: 5,
    paddingVertical: 11,
    paddingHorizontal: 8,
    margin: "2%",
    borderWidth: 1,
    borderColor: "transparent",
  },
  wordItemFocused: {
    borderColor: "#fff",
  },
  wordNumber: {
    color: "#999",
    fontSize: 10,
    marginRight: 6,
  },
  wordText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  wordInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    padding: 0,
    margin: 0,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    width: "100%",
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
  },
});
