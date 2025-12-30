import { TouchableOpacity, TouchableOpacityProps } from "react-native";

export default function CustomTouch(props: TouchableOpacityProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} {...props}>
      {props.children}
    </TouchableOpacity>
  );
}
