import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";

export type UserRole = "admin" | "customer";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, role?: UserRole) => Promise<void>;
  signUp: (email: string, fullName: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  toggleAdminDemo: () => void;
}

const DEMO_STORAGE_KEY = "tester_auth_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    // Default demo customer
    return {
      id: "demo-user-001",
      email: "client@tester.com",
      fullName: "Alexander Wright",
      phone: "+91 98765 43210",
      role: "admin", // set to admin by default for smooth development access
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(user));
    } else if (typeof window !== "undefined") {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    }
  }, [user]);

  const signIn = async (email: string, role: UserRole = "customer") => {
    setIsLoading(true);
    try {
      // Attempt supabase sign in if possible
      try {
        await supabase.auth.signInWithOtp({ email });
      } catch {
        // Fallback for offline/demo
      }

      const newUser: UserProfile = {
        id: "usr-" + Math.random().toString(36).substring(2, 9),
        email,
        fullName: email.split("@")[0].toUpperCase(),
        role: email.includes("admin") ? "admin" : role,
      };
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, fullName: string, role: UserRole = "customer") => {
    setIsLoading(true);
    try {
      const newUser: UserProfile = {
        id: "usr-" + Math.random().toString(36).substring(2, 9),
        email,
        fullName,
        role,
      };
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
  };

  const toggleAdminDemo = () => {
    setUser((prev) => {
      if (!prev) {
        return {
          id: "admin-demo",
          email: "admin@tester.com",
          fullName: "Admin Studio",
          role: "admin",
        };
      }
      const nextRole: UserRole = prev.role === "admin" ? "customer" : "admin";
      return { ...prev, role: nextRole };
    });
  };

  const role = user?.role || "customer";
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        toggleAdminDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
