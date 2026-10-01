import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { API_URL, api, setToken, setOnUnauthorized } from "./api";

WebBrowser.maybeCompleteAuthSession();
const KEY = "notes_token";
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(signOut);
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(KEY);
        if (saved) {
          setToken(saved);
          setUser(await api.me());
        }
      } catch {
        await signOut();
      } finally {
        setLoading(false);
      }
    })();
  }, [signOut]);

  const signIn = async (provider) => {
    const redirect = Linking.createURL("auth");
    const result = await WebBrowser.openAuthSessionAsync(
      `${API_URL}/auth/${provider}?redirect=${encodeURIComponent(redirect)}`,
      redirect,
    );
    if (result.type !== "success") return;
    const { queryParams } = Linking.parse(result.url);
    if (!queryParams?.token) throw new Error("No se pudo iniciar sesión");
    await SecureStore.setItemAsync(KEY, queryParams.token);
    setToken(queryParams.token);
    setUser(await api.me());
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
