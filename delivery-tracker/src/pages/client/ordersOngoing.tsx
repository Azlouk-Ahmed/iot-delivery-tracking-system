import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Truck, User, Phone } from "lucide-react";

type Order = {
  id: string;
  vehicle: string;
  driverName: string;
  driverPhone: string;
  companyAddress: string;
  deliveryAddress: string;
  status: string;
};

export default function OrdersOngoing() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "CMD-4521",
        vehicle: "Truck 12",
        driverName: "Ahmed Ben Ali",
        driverPhone: "+21698765432",
        companyAddress: "Avenue de la Liberté, Tunis",
        deliveryAddress: "Rue de la Paix, Tunis",
        status: "In Delivery",
      },
      {
        id: "CMD-4522",
        vehicle: "Truck 8",
        driverName: "Sami Trabelsi",
        driverPhone: "+21698765433",
        companyAddress: "Rue 123, Tunis",
        deliveryAddress: "Avenue Habib Bourguiba, Tunis",
        status: "In Delivery",
      },
    ];

    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter((order) =>
    [order.id, order.vehicle, order.driverName, order.driverPhone, order.companyAddress, order.deliveryAddress]
      .some((value) => value.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold text-yellow-500">Ongoing Orders</h1>

      {/* Search bar with clear button */}
      <div className="relative max-w-sm">
        <Input
          placeholder="Search by order, driver, vehicle, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-8"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Orders in Delivery</CardTitle>
          <Truck className="h-5 w-5 text-gray-900" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{filteredOrders.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>List of Ongoing Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company Address</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Tracking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.vehicle}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" /> {order.driverName}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-500" /> {order.driverPhone}
                    </TableCell>
                    <TableCell>{order.driverPhone}</TableCell>
                    
                    <TableCell>{order.companyAddress}</TableCell>
                    <TableCell>{order.deliveryAddress}</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-1 rounded text-sm">
                            Track
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>View live map</TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    No results found...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
