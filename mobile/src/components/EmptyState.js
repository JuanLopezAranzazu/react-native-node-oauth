import React from "react";
import { VStack, Text, Icon } from "@gluestack-ui/themed";
import { useTheme } from "../theme";

export default function EmptyState({ icon, message }) {
  const { colors } = useTheme();
  return (
    <VStack alignItems="center" space="md" mt="$16">
      {icon && <Icon as={icon} size="xl" color={colors.muted} />}
      <Text color={colors.muted} textAlign="center">
        {message}
      </Text>
    </VStack>
  );
}
