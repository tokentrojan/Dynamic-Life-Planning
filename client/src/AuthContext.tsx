import { createContext, useContext } from "react";
import { User } from "firebase/auth";

// Create a context for authentication
export const AuthContext = createContext<{ currentUser: User | null } | null>(
  null
);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
