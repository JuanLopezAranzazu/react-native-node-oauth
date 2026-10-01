import { createConfig } from "@gluestack-style/react";
import { config as defaultConfig } from "@gluestack-ui/config";
import { primary, palettes } from "./colors";

const primaryTokens = Object.fromEntries(
  Object.entries(primary).map(([k, v]) => [`primary${k}`, v]),
);

export const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      ...primaryTokens,
      textLight900: palettes.light.text,
      textDark50: palettes.dark.text,
      error600: palettes.light.danger,
      error400: palettes.dark.danger,
    },
  },
});
