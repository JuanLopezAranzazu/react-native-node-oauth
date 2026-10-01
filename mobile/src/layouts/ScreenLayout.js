import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Box } from "@gluestack-ui/themed";
import { useTheme } from "../theme";

export default function ScreenLayout({
  header,
  footer,
  children,
  center = false,
  keyboard = false,
}) {
  const { colors } = useTheme();

  const body = (
    <Box
      flex={1}
      bg={colors.bg}
      pt={center ? 0 : "$12"}
      px={center ? "$8" : "$5"}
      justifyContent={center ? "center" : "flex-start"}
    >
      {header}
      {children}
      {footer}
    </Box>
  );

  if (!keyboard) return body;
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {body}
    </KeyboardAvoidingView>
  );
}
