import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase"; // Adjust the path to your firebase.ts file
import { AuthContext } from "./AuthContext"; // Import the context

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        localStorage.setItem("cachedUID", user.uid); // ✅ Cache UID for offline use
      }else {
        localStorage.removeItem("cachedUID");
      }
    });

    return () => unsubscribe();
  }, []); // Removed 'auth' from the dependency array

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};