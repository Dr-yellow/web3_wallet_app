import { ThemedText } from "@/components/themed-text";
import { BaseModal } from "@/components/ui/modal/BaseModal";
import { grayScale } from "@/constants/theme/base";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface AddNodeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (name: string, url: string) => void;
}

export function AddNodeModal({
  visible,
  onClose,
  onConfirm,
}: AddNodeModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleConfirm = () => {
    if (name.trim() && url.trim()) {
      onConfirm(name.trim(), url.trim());
      setName("");
      setUrl("");
    }
  };

  const handleClose = () => {
    setName("");
    setUrl("");
    onClose();
  };

  return (
    <BaseModal visible={visible} onClose={handleClose}>
      <ThemedText style={styles.modalTitle}>添加自定义节点</ThemedText>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="请输入节点名称"
          placeholderTextColor={grayScale[200]}
          value={name}
          onChangeText={setName}
          autoFocus={visible}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="例如:https://etc.rivet.link"
          placeholderTextColor={grayScale[200]}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={handleClose}
        >
          <ThemedText style={styles.cancelButtonText}>取消</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.confirmButton]}
          onPress={handleConfirm}
        >
          <ThemedText style={styles.confirmButtonText}>确认</ThemedText>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
    color: "#fff",
  },
  inputContainer: {
    backgroundColor: "#2c2c2e",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    padding: 0,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#2c2c2e",
  },
  confirmButton: {
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#000",
    fontWeight: "600",
  },
});
