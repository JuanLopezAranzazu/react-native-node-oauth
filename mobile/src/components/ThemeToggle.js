import React from "react";
import { Sun, Moon } from "lucide-react-native";
import IconButton from "./IconButton";
import { useTheme } from "../theme";

export default function ThemeToggle(props) {
  const { isDark, toggle } = useTheme();
  return (
    <IconButton
      icon={isDark ? Sun : Moon}
      onPress={toggle}
      label="Cambiar tema"
      {...props}
    />
  );
}
