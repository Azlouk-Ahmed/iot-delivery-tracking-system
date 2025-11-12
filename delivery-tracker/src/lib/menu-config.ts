import type { MenuConfig } from "@/types/types"
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
} from "lucide-react"


export const menuConfig: MenuConfig = {
  super_admin: [
      {
        label: "Administration",
        items: [
          { title: "Tableau de bord", url: "/dashboard", icon: Home },
          { 
            title: "Delivery Companies", 
            url: "/companies", 
            icon: Building,
            subItems: [
              { title: "All Partners", url: "/companies/all", icon: List },
              { title: "Add Partners", url: "/companies/add", icon: Building },
              { title: "Manage Partners", url: "/companies/manage", icon: Settings },
            ]
          },
          { 
            title: "Gestion Personnel", 
            url: "/personnel", 
            icon: Users,
            subItems: [
              { title: "Super Admins", url: "/personnel/super-admins", icon: ShieldCheck },
              { title: "Admins", url: "/personnel/admins", icon: ShieldCheck },
              { title: "Chauffeurs", url: "/personnel/chauffeurs", icon: Truck },
              { title: "Clients", url: "/personnel/clients", icon: Users },
            ]
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
              { title: "Manage", url: "/deliveries/manage", icon: Settings },
            ]
          },
          { 
            title: "Suivi en temps réel", 
            url: "/tracking", 
            icon: MapPin,
            subItems: [
              { title: "All Cars", url: "/tracking/all-cars", icon: Car },
              { title: "Specific Cars", url: "/tracking/specific-cars", icon: MapPin },
            ]
          },
          { title: "Alertes & incidents", url: "/alerts", icon: AlertTriangle },
        ],
      },
      {
        label: "Analyse & Paramètres",
        items: [
          { title: "Statistiques", url: "/stats", icon: BarChart },
          { title: "Paramètres système", url: "/settings", icon: Settings },
        ],
      },
    ],
admin: [
  {
    label: "Management",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { 
        title: "Personnel Management",  // TRANSLATED
        url: "/personnel", 
        icon: Users,
        subItems: [
          { title: "Admins", url: "/personnel/admins", icon: ShieldCheck },
          { title: "Drivers", url: "/personnel/drivers", icon: Truck },
          { title: "Clients", url: "/personnel/clients", icon: Users },
        ]
      },
      { 
        title: "Deliveries", 
        url: "/deliveries", 
        icon: Package,
        subItems: [
          { title: "All", url: "/deliveries/all", icon: List },
          { title: "In Progress", url: "/deliveries/ongoing", icon: Truck },
          { title: "Delivered", url: "/deliveries/completed", icon: CheckCircle },
          { title: "Scheduled", url: "/deliveries/scheduled", icon: Calendar },
        ]
      },
      { 
        title: "Vehicles", 
        url: "/vehicles", 
        icon: Truck,
        subItems: [
          { title: "All Vehicles", url: "/vehicles/all", icon: List },
          { title: "Available", url: "/vehicles/available", icon: Car },
          { title: "In Service", url: "/vehicles/in-service", icon: Truck },
        ]
      },
      { 
        title: "Drivers", 
        url: "/drivers", 
        icon: Users,
        subItems: [
          // { title: "All Drivers", url: "/drivers/all", icon: List },
          { title: "In Service", url: "/drivers/active", icon: CheckCircle },
          { title: "Offline", url: "/drivers/offline", icon: XCircle },
        ]
      },
    ],
  },
  {
    label: "Tracking & Alerts",
    items: [
      { title: "Real-Time Map", url: "/tracking", icon: MapPin },
      { title: "Alerts", url: "/alerts", icon: Bell },
    ],
  },
  {
    label: "Settings",
    items: [{ title: "Account", url: "/settings", icon: Settings }],
  },
],
  driver: [
      {
        label: "Mes opérations",
        items: [
          { title: "Accueil", url: "/home", icon: Home },
          { 
            title: "Mes trajets", 
            url: "/trips", 
            icon: Truck,
            subItems: [
              { title: "Trajet en cours", url: "/trips/current", icon: Truck },
              { title: "Trajets planifiés", url: "/trips/upcoming", icon: Calendar },
              { title: "Historique", url: "/trips/history", icon: List },
            ]
          },
          { title: "Marquer livraison", url: "/deliver", icon: ClipboardCheck },
          { title: "Alertes", url: "/alerts", icon: Bell },
        ],
      },
      {
        label: "Compte",
        items: [{ title: "Paramètres", url: "/settings", icon: Settings }],
      },
    ],
  user: [
      {
        label: "Suivi des commandes",
        items: [
          { title: "Accueil", url: "/home", icon: Home },
          { 
            title: "Mes livraisons", 
            url: "/my-deliveries", 
            icon: Package,
            subItems: [
              { title: "En cours", url: "/my-deliveries/ongoing", icon: Truck },
              { title: "Livrées", url: "/my-deliveries/completed", icon: CheckCircle },
              { title: "Historique", url: "/my-deliveries/history", icon: List },
            ]
          },
          { title: "Suivi en temps réel", url: "/tracking", icon: MapPin },
        ],
      },
      {
        label: "Notifications",
        items: [{ title: "Alertes", url: "/notifications", icon: Bell }],
      },
      {
        label: "Compte",
        items: [{ title: "Paramètres", url: "/settings", icon: Settings }],
      },
    ],
}