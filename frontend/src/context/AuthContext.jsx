import React, { createContext, useContext, useEffect, useState } from "react";
import { AUTH_ENDPOINTS } from "../api/endpoints";
import fetchWithAuth from "../FetchWithAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication (cookie-based)
  const checkAuth = async () => {
    try {
      const res = await fetchWithAuth(AUTH_ENDPOINTS.ME, {
        method: "GET",
        credentials: "include", // 🔥 important for cookies
      });

      if (!res.ok) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const data = await res.json();
      const userData = data.user || data.data || data;

      // Normalize role
      const role =
        userData.role ||
        userData.userType ||
        userData.user_type ||
        userData.type ||
        "";

      const normalizedUser = {
        ...userData,
        role: typeof role === "string" ? role.toUpperCase() : "",
      };

      setUser(normalizedUser);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login (after backend sets cookie)
  const login = async (userData) => {
    if (userData) {
      const role =
        userData.role ||
        userData.userType ||
        userData.user_type ||
        userData.type ||
        "";

      const normalizedUser = {
        ...userData,
        role: typeof role === "string" ? role.toUpperCase() : "",
      };

      setUser(normalizedUser);
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      await checkAuth(); // fallback
    }
  };

  // Logout (server clears cookie)
  const logout = async () => {
    try {
      await fetch(AUTH_ENDPOINTS.LOGOUT, {
        method: "POST",
        credentials: "include", // 🔥 required
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    // ❌ removed localStorage + document.cookie (not needed)

    setUser(null);
    setIsAuthenticated(false);

    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshUser: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};