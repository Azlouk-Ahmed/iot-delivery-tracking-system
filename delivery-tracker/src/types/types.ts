import { type LucideIcon } from "lucide-react";

export type Role = "super_admin" | "admin" | "user" | "driver" | undefined;

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
  role?: Role;
  authMethod?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}

export type AuthAction =
  | { type: "LOGIN"; payload: { user: User; accessToken: string } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }; 

export interface UseFetchOptions {
    immediate?: boolean;
    useAuth?: boolean;
    dependencies?: any[];
}

export interface UseFetchReturn<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}
export interface Member {
  _id: number;
  name: string;
  avatar?: string;
  joinedDate: string;
  phone: string;
  email: string;
  suspended: boolean;
}

export interface Point {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface Driver {
  _id: string;
  email: string;
  name: string;
  photo?: string;
}

export interface Vehicle {
  _id: string;
  vehicleId: string;
  model: string;
  licensePlate: string;
  driverId: Driver;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  companyId?: string;
}

export interface Session {
  vehicle: Vehicle;
  sessionId: string;
  points: Point[];
}

export interface MemberCardProps {
  member: Member;
}

export interface TrajectoryCardProps {
  trajectory: Session;
}

export interface TrajectoryMapProps {
  trajectoryArray: Session | null;
}

export interface MapBoundsProps {
  points: Point[];
}