// src/context/AuthContext.jsx
// Global auth state — provides user, token, role helpers to all components.

import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("access_token") || null);

  const login = useCallback((arg1, arg2) => {
    let tokenVal = arg1;
    let userData = arg2;

    if (typeof arg1 === "object" && arg1 !== null) {
      if (arg1.token && arg1.user) {
        tokenVal = arg1.token;
        userData = arg1.user;
      } else if (arg1.email || arg1.role) {
        tokenVal = arg1.token || "demo-jwt-token";
        userData = arg1.user || {
          name: arg1.name || (arg1.email ? arg1.email.split("@")[0] : "Campus User"),
          email: arg1.email || "user@campusos.edu",
          role: (arg1.role || "student").toLowerCase()
        };
      }
    }

    if (!tokenVal) tokenVal = "demo-jwt-token";
    if (!userData) {
      userData = { name: "Campus User", email: "user@campusos.edu", role: "student" };
    }

    if (userData.role) {
      userData.role = userData.role.toLowerCase();
    }

    localStorage.setItem("access_token", tokenVal);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const role = user?.role?.toLowerCase() || "student";
  const isFaculty = role === "faculty" || role === "staff" || role === "admin" || role === "tpo";
  const isStudent = !isFaculty;
  const isStaff = isFaculty;
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        role,
        isStudent,
        isFaculty,
        isStaff,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
