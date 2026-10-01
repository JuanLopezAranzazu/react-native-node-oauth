import React from "react";
import { Button, ButtonText, ButtonSpinner } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme";

const PROVIDERS = {
  google: {
    label: "Continuar con Google",
    icon: "logo-google",
    action: "secondary",
    variant: "outline",
  },
  github: {
    label: "Continuar con GitHub",
    icon: "logo-github",
    action: "primary",
    variant: "solid",
  },
};

export default function SocialButton({ provider, loading, disabled, onPress }) {
  const { colors } = useTheme();
  const p = PROVIDERS[provider];
  const iconColor = p.variant === "solid" ? colors.onPrimary : colors.icon;
  return (
    <Button
      size="xl"
      action={p.action}
      variant={p.variant}
      onPress={() => onPress(provider)}
      isDisabled={disabled}
    >
      {loading ? (
        <ButtonSpinner mr="$2" />
      ) : (
        <Ionicons
          name={p.icon}
          size={18}
          color={iconColor}
          style={{ marginRight: 8 }}
        />
      )}
      <ButtonText>{p.label}</ButtonText>
    </Button>
  );
}
