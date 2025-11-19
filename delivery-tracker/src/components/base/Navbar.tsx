//@ts-nocheck
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, ChevronUp, Car } from "lucide-react";
import type { Role } from "@/types/types";
import { menuConfig } from "@/lib/menu-config";
import { useAuthContext } from "@/hooks/useAuthContext";
import useLogout from "@/hooks/useLogOut";
import { useSocket } from "@/hooks/useSocketContext";
import type { VehicleData } from "@/pages/Home";

function Navbar() {
  const { socket, isConnected } = useSocket();
  const [vehicles, setVehicles] = useState<Map<string, VehicleData>>(new Map());
  const { user } = useAuthContext();
  const role: Role = user?.role;
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [notificationsCount, setNotificationsCount] = useState(2); // Nombre de notifications non lues

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const { logout } = useLogout();

  // Listen to socket events for vehicle updates
  useEffect(() => {
    if (!socket) return;

    socket.on('vehicle-status', (data) => {
      setVehicles(prev => {
        const updated = new Map(prev);
        updated.set(data.vehicleId, {
          vehicleId: data.vehicleId,
          status: data.status,
          driverName: data.driverName,
          model: data.model,
          companyName: data.companyName,
          sessionId: data.sessionId,
          timestamp: data.timestamp
        });
        return updated;
      });
    });

    socket.on('vehicle-gps', (data) => {
      setVehicles(prev => {
        const updated = new Map(prev);
        const existing = updated.get(data.vehicleId);
        if (existing) {
          updated.set(data.vehicleId, {
            ...existing,
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: data.timestamp
          });
        }
        return updated;
      });
    });

    return () => {
      socket.off('vehicle-status');
      socket.off('vehicle-gps');
    };
  }, [socket]);

  // Calculate active vehicles count
  const activeVehiclesCount = Array.from(vehicles.values()).filter(
    v => v.status === 'ON'
  ).length;

  const currentGroups = menuConfig[role] || [];

  return (
    <Sidebar>


      <SidebarContent>
        {currentGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="cursor-pointer text-xs">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const itemKey = `${group.label}-${item.title}`;
                  const isOpen = openItems[itemKey];

                  if (item.subItems && item.subItems.length > 0) {
                    return (
                      <Collapsible
                        key={item.title}
                        open={isOpen}
                        onOpenChange={() => toggleItem(itemKey)}
                        className="group/collapsible cursor-pointer mt-1.5"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="cursor-pointer">
                              <item.icon />
                              <span className="font-bold text-sm">
                                {item.title === "Suivi en temps réel" ?
                                  (
                                    <>
                                      {
                                        item.title
                                      }
                                      <span className="bg-destructive px-1 rounded  inline-block ml-2 text-[10px]">{activeVehiclesCount}</span>
                                    </>
                                  )

                                  : item.title}

                              </span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="CollapsibleContent">
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <a href={subItem.url}>
                                      <subItem.icon className="h-4 w-4" />
                                      <span className="text-sm">
                                        {subItem.title}
                                      </span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>
                            {item.title}
                            {/* Ajoutez cet indicateur pour le menu Alertes */}
                            {item.title === "Alertes" && notificationsCount > 0 && (
                              <span className="bg-red-500 px-2 py-0.5 rounded-full inline-block ml-2 text-[10px] text-white font-bold">
                                {notificationsCount}
                              </span>
                            )}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <SidebarMenuButton className="h-auto py-2">
                  <Avatar>
                    <AvatarImage src={user?.photo} />
                    <AvatarFallback>
                      {user?.name[0] + user?.name[1]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                  className="cursor-pointer"
                >
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default Navbar;