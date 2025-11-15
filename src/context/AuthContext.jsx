import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogined, setIsLogined] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) setIsLogined(true);
  }, []);

  const authenticate = (token, user) => {
    localStorage.setItem("jwt_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsLogined(true);
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setIsLogined(false);
  };
  return (
    <AuthContext.Provider
      value={{ isLogined, setIsLogined, logout, authenticate }}
    >
      {children}
    </AuthContext.Provider>
  );
};
