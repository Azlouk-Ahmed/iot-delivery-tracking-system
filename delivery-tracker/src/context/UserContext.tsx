import React, { createContext, useContext } from "react";

export type Role = "super_admin" | "admin" | "client" | "driver";

interface UserContextType {
  role: Role;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ role: Role; children: React.ReactNode }> = ({ role, children }) => {
  return <UserContext.Provider value={{ role }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
