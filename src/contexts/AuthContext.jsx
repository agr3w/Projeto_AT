import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContextObject";
import { getFriendlyApiErrorMessage, loginUser } from "../services/api";

const AUTH_STORAGE_KEY = "auth_user";

const getInitialUser = () => {
  try {
    const savedUser = JSON.parse(
      localStorage.getItem(AUTH_STORAGE_KEY) || "null",
    );
    return savedUser;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const login = async (email, senha) => {
    try {
      const data = await loginUser(email, senha);

      if (!data.success) {
        return { success: false, message: data.message };
      }

      // Se deu sucesso, salva o usuário que veio lá do PostgreSQL
      setUser(data.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      console.error("[AuthContext] Erro tecnico no login:", {
        error,
        message: error?.message,
      });
      return {
        success: false,
        message: getFriendlyApiErrorMessage(
          error,
          "Nao foi possivel realizar login no momento. Tente novamente.",
        ),
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
