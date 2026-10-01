"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { getAuthToken, getCurrentUser, restoreGitHubSession } from "@/services/auth-service";

interface User {
  id: string;
  name: string;
  email: string;
  githubConnected?: boolean;
  githubUsername?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const restoreUser = async () => {
      if (typeof window === "undefined") return;

      if (user) return;

      try {
        const token = getAuthToken();
        if (token) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          return;
        }

        const restoredSession = await restoreGitHubSession();
        if (restoredSession?.user) {
          setUser(restoredSession.user);
        }
      } catch (error) {
        console.warn("Unable to restore auth user:", error);

        const restoredSession = await restoreGitHubSession();
        if (restoredSession?.user) {
          setUser(restoredSession.user);
        }
      }
    };

    restoreUser();
  }, [user]);

  const login = useCallback((user: User) => {
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
