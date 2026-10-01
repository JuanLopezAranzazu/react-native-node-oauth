import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";
import { palettes } from "./colors";

const KEY = "notes_theme";
const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [mode, setMode] = useState(null);

  useEffect(() => {
    SecureStore.getItemAsync(KEY).then((saved) => {
      if (saved === "light" || saved === "dark") setMode(saved);
    });
  }, []);

  const resolved = mode || (system === "dark" ? "dark" : "light");

  const toggle = useCallback(() => {
    const next = resolved === "dark" ? "light" : "dark";
    setMode(next);
    SecureStore.setItemAsync(KEY, next);
  }, [resolved]);

  return (
    <ThemeContext.Provider
      value={{
        mode: resolved,
        isDark: resolved === "dark",
        toggle,
        colors: palettes[resolved],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
