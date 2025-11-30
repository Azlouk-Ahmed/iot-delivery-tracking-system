import type { MenuConfig } from "@/types/types";
import {
  Home,
  Users,
  Building,
  Truck,
  Package,
  MapPin,
  Bell,
  Settings,
  BarChart,
  ShieldCheck,
  ClipboardCheck,
  AlertTriangle,
  Car,
  List,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const menuConfig: MenuConfig = {
  super_admin: [
    {
      label: "Administration",
      items: [
        { title: "Tableau de bord", url: "/", icon: Home },
        {
          title: "Delivery Companies",
          url: "/companies",
          icon: Building,
          subItems: [
            { title: "All Partners", url: "/companies/all", icon: List },
            { title: "Add Partners", url: "/companies/add", icon: Building },
          ],
        },
        {
          title: "Gestion Personnel",
          url: "/personnel",
          icon: Users,
          subItems: [
            {
              title: "Super Admins",
              url: "/personnel/super-admins",
              icon: ShieldCheck,
            },
            { title: "Admins", url: "/personnel/admins", icon: ShieldCheck },
            { title: "Chauffeurs", url: "/personnel/chauffeurs", icon: Truck },
          ],
        },
        {
          title: "Vehicles",
          url: "/vehicles",
          icon: Truck,
          subItems: [
            { title: "All Vehicles", url: "/vehicles/all", icon: List },
            { title: "Active", url: "/vehicles/available", icon: Car },
          ],
        },
      ],
    },
    {
      label: "Opérations",
      items: [
        {
          title: "Livraison",
          url: "/deliveries",
          icon: Package,
          subItems: [
            { title: "Tous Livraison", url: "/deliveries/all", icon: List },
            { title: "Track Delivery", url: "/deliveries/track", icon: Settings },
          ],
        },
        {
          title: "Suivi en temps réel",
          url: "/tracking",
          icon: MapPin,
          subItems: [
            { title: "All Cars", url: "/tracking/all-cars", icon: Car },
 
          ],
        },
        {
          title: "Trajectories Trace",
          url: "/trajectories",
          icon: AlertTriangle,
        },
      ],
    },

    
    {
      label: "Analyse & Paramètres",
      items: [
        { title: "Paramètres système", url: "/settings", icon: Settings },
      ],
      
    },
  ],
  admin: [
    {
      label: "Admin Management",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        {
          title: "Personnel Management",
          url: "/personnel",
          icon: Users,
          subItems: [
            { title: "Admins", url: "/personnel/admins", icon: ShieldCheck },
            { title: "Drivers", url: "/personnel/drivers", icon: Truck },
          ],
        },
        {
          title: "Deliveries",
          url: "/deliveries",
          icon: Package,
          subItems: [
            { title: "All", url: "/deliveries/all", icon: List },
            { title: "Track delivery", url: "/deliveries/ongoing", icon: Truck },
           
          ],
        },
        {
          title: "Vehicles",
          url: "/vehicles",
          icon: Truck,
          subItems: [
            { title: "All Vehicles", url: "/vehicles/all", icon: List },
            { title: "Active now", url: "/vehicles/available", icon: Car },
          ],
        },
      ],
    },
    {
      label: "Tracking & Alerts",
      items: [
        { title: "Real-Time Map", url: "/live", icon: MapPin },
        { title: "Alerts", url: "/alerts", icon: Bell },
      ],
    },

    {
      label: "Analyse & Paramètres",
      items: [
        { title: "Paramètres système", url: "/settings", icon: Settings },
      ],
    },
  ],
  driver: [
    {
      label: "Mes opérations",
      items: [
        { title: "Accueil", url: "/", icon: Home },
        {
          title: "Mes trajets",
          url: "/trips",
          icon: Truck,
          subItems: [
            { title: "Historique", url: "/trips/history", icon: List },
          ],
        },
        { title: "Marquer livraison", url: "/deliver", icon: ClipboardCheck },
        { title: "Alertes", url: "/alerts", icon: Bell },
      ],
    },
    {
      label: "Analyse & Paramètres",
      items: [
        { title: "Paramètres système", url: "/settings", icon: Settings },
      ],
    },
  ],
  user: [
    {
      label: "Order Tracking",
      items: [
        { title: "Dashboard", url: "/", icon: Home },
        {
          title: "My Orders",
          url: "/orders",
          icon: Package,
          subItems: [
            { title: "All", url: "/orders/ongoing", icon: Truck },
          ],
        },
        { title: "Live Tracking", url: "/tracking", icon: MapPin },
      ],
    },
    {
      label: "Notifications",
      items: [{ title: "Alerts", url: "/notifications", icon: Bell }],
    },
    {
      label: "Account",
      items: [{ title: "Settings", url: "/settings", icon: Settings }],
    },
    {
      label: "Analyse & Paramètres",
      items: [
        { title: "Paramètres système", url: "/settings", icon: Settings },
      ],
    },
  ],
};
