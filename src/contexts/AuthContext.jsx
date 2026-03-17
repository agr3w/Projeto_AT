import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContextObject";

const AUTH_STORAGE_KEY = "auth_user";

const getInitialUser = () => {
  try {
    const savedUser = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    return savedUser;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const login = (email, senha) => {
    let authenticatedUser = null;

    if (email === "admin@vendpago.com" && senha === "admin") {
      authenticatedUser = { nome: "Gestor", role: "admin" };
    }

    if (email === "operador@vendpago.com" && senha === "123") {
      authenticatedUser = { nome: "Operador", role: "operador" };
    }

    if (!authenticatedUser) {
      return { success: false, message: "Credenciais invalidas." };
    }

    setUser(authenticatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));

    return { success: true, user: authenticatedUser };
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

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
