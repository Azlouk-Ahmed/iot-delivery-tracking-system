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
        label: "Gestion",
        items: [
          { title: "Tableau de bord", url: "/dashboard", icon: Home },
          { 
            title: "Livraisons", 
            url: "/deliveries", 
            icon: Package,
            subItems: [
              { title: "Toutes", url: "/deliveries/all", icon: List },
              { title: "En cours", url: "/deliveries/ongoing", icon: Truck },
              { title: "Livrées", url: "/deliveries/completed", icon: CheckCircle },
              { title: "Planifiées", url: "/deliveries/scheduled", icon: Calendar },
            ]
          },
          { 
            title: "Véhicules", 
            url: "/vehicles", 
            icon: Truck,
            subItems: [
              { title: "Tous les véhicules", url: "/vehicles/all", icon: List },
              { title: "Disponibles", url: "/vehicles/available", icon: Car },
              { title: "En service", url: "/vehicles/in-service", icon: Truck },
            ]
          },
          { 
            title: "Chauffeurs", 
            url: "/drivers", 
            icon: Users,
            subItems: [
              { title: "Tous les chauffeurs", url: "/drivers/all", icon: List },
              { title: "En service", url: "/drivers/active", icon: CheckCircle },
              { title: "Hors service", url: "/drivers/offline", icon: XCircle },
            ]
          },
        ],
      },
      {
        label: "Suivi & Alertes",
        items: [
          { title: "Carte en temps réel", url: "/tracking", icon: MapPin },
          { title: "Alertes", url: "/alerts", icon: Bell },
        ],
      },
      {
        label: "Paramètres",
        items: [{ title: "Compte", url: "/settings", icon: Settings }],
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
    label: "Order Tracking",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
      { 
        title: "My Orders", 
        url: "/orders", 
        icon: Package,
        subItems: [
          { title: "Ongoing", url: "/orders/ongoing", icon: Truck },
          { title: "Delivered", url: "/orders/completed", icon: CheckCircle },
          { title: "History", url: "/orders/history", icon: List },
        ]
      },
      { title: "Live Tracking", url: "/tracking", icon: MapPin },
    ],
  },
  {
    label: "Notifications",
    items: [{ title: "Alerts", url: "/Clientnotify", icon: Bell }],
  },
  {
    label: "Account",
    items: [{ title: "Settings", url: "/settings", icon: Settings }],
  },
],

}