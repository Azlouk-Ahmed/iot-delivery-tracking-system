import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Truck, User, Phone, File, SortDesc, Filter } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import useFetch from "@/hooks/useFetchData";
import { OrdersDataTable } from "../shared/orders-table/ordersDataTable";
import { Switch } from "@/components/ui/switch";
import { ordersColumns, type Order } from "../shared/orders-table/ordersColumns";
import { FieldLabel } from "@/components/ui/field";

export default function OrdersOngoing() {
  const { data: deliveriesData } = useFetch("/delivery/all", { immediate: true });

   const [orders, setOrders] = useState<Order[]>([]);
    const [showDelivered, setShowDelivered] = useState(true);

    useEffect(() => {
      let sourceData = null;
    

        sourceData = deliveriesData?.deliveries;
    
      if (sourceData) {
        const mappedOrders: Order[] = sourceData.map((d: any) => ({
          id: d._id,
          email: d.user?.email || "N/A",
          user: d.user?.name || "Unknown",
          company: d.company?.name || "Unknown",
          vehicleId: d.vehicleId?.plateNumber || d.vehicleId?._id || "N/A",
          status: d.status,
          products: d.products || [],
          date: Date.now(),
        }));
    
        setOrders(mappedOrders);
      }
    }, [deliveriesData]);

     const filteredOrders = showDelivered
    ? orders
    : orders.filter((order) => order.status !== "delivered");



  return (
    <div className="flex flex-col gap-6 p-6">

       <div className="flex py-5 justify-between items-center">
        <h1 className="text-2xl font-semibold">Delivery Orders</h1>

        <div className="flex gap-6 items-center">
          <span className="flex gap-3 items-center">
            <Filter size={15} /> Filter
          </span>
          <span className="flex gap-3 items-center">
            <SortDesc size={15} /> Sort
          </span>
          <span className="flex gap-3 items-center">
            <FieldLabel htmlFor="delivered" className="cursor-pointer">
              Show delivered
            </FieldLabel>
            <Switch
              id="delivered"
              checked={showDelivered}
              onCheckedChange={setShowDelivered}
            />
          </span>
          <span className="flex gap-3 items-center">
            <File size={15} /> Export
          </span>

  
        </div>
      </div>

      <OrdersDataTable columns={ordersColumns} data={filteredOrders} />
    </div>
  );
}
