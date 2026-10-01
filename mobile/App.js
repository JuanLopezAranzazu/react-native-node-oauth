import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider, Center, Spinner } from "@gluestack-ui/themed";
import { config } from "./src/theme/config";
import { ThemeProvider, useTheme } from "./src/theme";
import { AuthProvider, useAuth } from "./src/auth";
import LoginScreen from "./src/screens/LoginScreen";
import NotesScreen from "./src/screens/NotesScreen";
import EditorScreen from "./src/screens/EditorScreen";

function Root() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  const [editing, setEditing] = useState(undefined);
  const [version, setVersion] = useState(0);

  if (loading)
    return (
      <Center flex={1} bg={colors.bg}>
        <Spinner size="large" />
      </Center>
    );
  if (!user) return <LoginScreen />;
  if (editing !== undefined)
    return (
      <EditorScreen
        note={editing}
        onClose={() => {
          setEditing(undefined);
          setVersion((v) => v + 1);
        }}
      />
    );
  return <NotesScreen key={version} onOpen={setEditing} />;
}

function Themed() {
  const { mode } = useTheme();
  return (
    <GluestackUIProvider config={config} colorMode={mode}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <AuthProvider>
        <Root />
      </AuthProvider>
    </GluestackUIProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Themed />
    </ThemeProvider>
  );
}
