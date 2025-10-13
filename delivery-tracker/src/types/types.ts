import { type LucideIcon } from "lucide-react"

export type Role = "super_admin" | "admin" | "client" | "chauffeur"

export interface SubMenuItem {
  title: string
  url: string
  icon: LucideIcon
}

export interface MenuItem {
  title: string
  url: string
  icon: LucideIcon
  subItems?: SubMenuItem[]
}

export interface MenuGroup {
  label: string
  items: MenuItem[]
}

export interface MenuConfig {
  [key: string]: MenuGroup[]
}