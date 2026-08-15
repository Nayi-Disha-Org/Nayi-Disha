import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Check memory when the app loads to see if someone is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && token) {
      try {
        // Added try/catch: Prevents the app from crashing if localStorage data gets corrupted
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, [token]);

  // Updated to handle cases where the token is passed, or if it was already saved to localStorage
  const loginUser = (userData, userToken) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // If a token is explicitly passed, use it. Otherwise, grab what RoleAuth just saved to localStorage.
    const activeToken = userToken || localStorage.getItem("token") || "";
    setToken(activeToken);
    
    if (userToken) {
      localStorage.setItem("token", activeToken);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // IMPORTANT: Instantly kick the user back out to the role selection screen
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};