"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Define the user type
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
}

// Define the authentication context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create the Auth Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check if the user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual auth check logic
        // Example: Check for token in localStorage and validate with API
        const token = localStorage.getItem("auth-token");

        if (token) {
          // Validate token with your API
          // const response = await fetch("/api/auth/validate", {
          //   headers: { Authorization: `Bearer ${token}` },
          // });

          // For demo purposes, simulate a user
          const userData: User = {
            id: "user-123",
            email: "user@example.com",
            name: "John Doe",
            role: "user",
          };

          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        localStorage.removeItem("auth-token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Replace with your actual login API call
      // const response = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();

      // For demo purposes, simulate successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate response data
      const data = {
        user: {
          id: "user-123",
          email: email,
          name: "John Doe",
          role: "user",
        },
        token: "example-auth-token",
      };

      // Save token
      localStorage.setItem("auth-token", data.token);

      // Update user state
      setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials. Please try again.");
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
  };

  // Return the provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
