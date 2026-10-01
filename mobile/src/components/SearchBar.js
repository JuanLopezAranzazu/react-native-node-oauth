import React from "react";
import { Input, InputField, InputSlot, InputIcon } from "@gluestack-ui/themed";
import { Search } from "lucide-react-native";
import { useTheme } from "../theme";

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar notas",
}) {
  const { colors } = useTheme();
  return (
    <Input bg={colors.card} borderColor={colors.border}>
      <InputSlot pl="$3">
        <InputIcon as={Search} color={colors.muted} />
      </InputSlot>
      <InputField
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </Input>
  );
}
