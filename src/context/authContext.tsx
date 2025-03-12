"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export interface User {
  username: string;
  full_name: string;
  email: string;
  created_at: string;
}

// Define the authentication context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  error: null,
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

const getUser = async (setIsLoading: (isLoading: boolean) => void) => {
  const token = localStorage.getItem("auth-token");

  if (token) {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://gourmet.cours.quimerch.com/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsLoading(false);
      return response.data;
    } catch {
      localStorage.removeItem("auth-token");
    }
    setIsLoading(false);

    return null;
  }
};

// Create the Auth Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check if the user is authenticated on initial load
  useEffect(() => {
    getUser(setIsLoading).then((userData) => {
      setUser(userData);
      setIsLoading(false);
    });
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://gourmet.cours.quimerch.com/login",
        {
          username: username,
          password: password,
        }
      );
      const data = response.data;

      // Save token
      localStorage.setItem("auth-token", data.token);

      const user = await getUser(setIsLoading);
      if (user) {
        setUser(user);
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Mot de passe ou nom d'utilisateur incorrect.");
    } finally {
      setIsLoading(false);
    }
    if (user) {
      router.push("/");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Replace with your actual logout API call if needed
      // await fetch("/api/auth/logout", { method: "POST" });

      // Clear local storage
      localStorage.removeItem("auth-token");

      // Clear user state
      setUser(null);

      // Redirect to login
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Create the context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
  };

  // Return the provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
