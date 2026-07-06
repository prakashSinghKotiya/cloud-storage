import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/user.api";
import { loginWithGoogle } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

const loadUser = async () => {
  try {
    setIsAuthLoading(true);

    const res = await fetchUser();
    setUser(res?.user || res);
  } catch (error) {
    if (error.response?.status === 401) {
      setUser(null);
    } else {
      console.error("loadUser failed:", error);
      // Don't log the user out for 429/500/network errors
    }
  } finally {
    setIsAuthLoading(false);
  }
};


  useEffect(() => {
    loadUser();
  }, []);

  const handleLogin = async (formData) => {
    const res = await loginUser(formData);
    console.log("loginr.res", res);
    await loadUser();
    return res;
  };


  const handleRegister = async (formData) => {
    return await registerUser(formData);
  };

  const handleGoogleLogin = async (idToken) => {
    const res = await loginWithGoogle(idToken);
    await loadUser();
    return res;
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthLoading,
      loadUser,
      login: handleLogin,
      register: handleRegister,
      googleLogin: handleGoogleLogin,
      logout: handleLogout,
      isAuthenticated: !!user,
    }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}