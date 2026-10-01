import React, { useState } from "react";
import { Box, VStack, Heading, Text } from "@gluestack-ui/themed";
import { ScreenLayout } from "../layouts";
import { SocialButton, ThemeToggle } from "../components";
import { useAuth } from "../auth";
import { useTheme } from "../theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  const go = async (provider) => {
    setBusy(provider);
    setError("");
    try {
      await signIn(provider);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <ScreenLayout center>
      <Box position="absolute" top="$16" right="$6">
        <ThemeToggle />
      </Box>

      <VStack space="xl">
        <VStack space="sm">
          <Heading size="3xl">Tus notas, en cualquier lugar</Heading>
          <Text size="md" color={colors.muted}>
            Inicia sesión para guardar y sincronizar tus notas.
          </Text>
        </VStack>

        <VStack space="md">
          {["google", "github"].map((p) => (
            <SocialButton
              key={p}
              provider={p}
              loading={busy === p}
              disabled={!!busy}
              onPress={go}
            />
          ))}
        </VStack>

        {!!error && <Text color={colors.danger}>{error}</Text>}
      </VStack>
    </ScreenLayout>
  );
}
