import { CommonStyles } from "@/constants/theme/styles";
import { StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "../themed-text";
import Switch from "./Switch";

interface SwitchRowProps {
  label: string;
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

export default function SwitchRow({
  label,
  value,
  onChange = () => {},
  disabled,
  style,
  ...props
}: SwitchRowProps & ViewProps) {
  return (
    <View
      style={[styles.row, disabled && styles.disabledText, style]}
      {...props}
    >
      <ThemedText style={[styles.label]}>{label}</ThemedText>
      <Switch value={value} onValueChange={onChange} disabled={disabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 40,
    ...CommonStyles.rowContainer,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {},
  disabledText: {
    opacity: 0.4,
  },
});
