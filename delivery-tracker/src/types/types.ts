import { type LucideIcon } from "lucide-react";

export type Role = "super_admin" | "admin" | "client" | "chauffeur";

export interface SubMenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  subItems?: SubMenuItem[];
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export interface MenuConfig {
  [key: string]: MenuGroup[];
}

export interface User {
  _id?: string;
  name?: string;
  email?: string;
  photo?: string | null;
  authMethod?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean; // Added loading state
}

export type AuthAction =
  | { type: "LOGIN"; payload: { user: User; accessToken: string } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }; // Added loading action