
import { useAuthContext } from '@/hooks/useAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useFetch from '@/hooks/useFetchData';
import { useEffect, useState } from 'react';
import { ordersColumns, type Order } from "./shared/orders-table/ordersColumns";
import { File, SortDesc, Filter } from "lucide-react";
import { FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { OrdersDataTable } from './shared/orders-table/ordersDataTable';


function DriverHome() {
 const { user } = useAuthContext();

  const { data: deliveriesData } = useFetch("/delivery/driver", { immediate: true });

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
    <div className="p-6 space-y-6">
      <div className="p-4 bg-primary/30 rounded-2xl">
        <div className="flex gap-4 items-center">
          <Avatar className="w-28 h-28">
            <AvatarImage src={user?.photo} />
            <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-2xl font-bold">
              Welcome Back, <span className="text-primary">{user?.name}</span>
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    

      {/* Deliveries Table */}
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
    </div>
  );
}

export default DriverHome;