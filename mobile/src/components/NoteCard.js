import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Pressable,
  Icon,
} from "@gluestack-ui/themed";
import { Pin } from "lucide-react-native";
import { useTheme } from "../theme";

export default function NoteCard({ note, onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={() => onPress(note)}>
      <Box
        bg={colors.card}
        p="$4"
        borderRadius="$lg"
        borderWidth={1}
        borderColor={colors.border}
      >
        <VStack space="xs">
          <HStack justifyContent="space-between" alignItems="center" space="sm">
            <Text bold size="lg" numberOfLines={1} flex={1}>
              {note.title || "Sin título"}
            </Text>
            {note.pinned && <Icon as={Pin} size="sm" color={colors.primary} />}
          </HStack>
          <Text size="sm" color={colors.muted} numberOfLines={3}>
            {note.content}
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );
}
