import React from "react";
import { Pressable, Icon } from "@gluestack-ui/themed";
import { useTheme } from "../theme";

export default function IconButton({
  icon,
  onPress,
  label,
  color,
  size = "xl",
  ...rest
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      p="$1"
      {...rest}
    >
      <Icon as={icon} size={size} color={color || colors.icon} />
    </Pressable>
  );
}
