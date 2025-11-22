import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Truck } from "lucide-react";

// Type for delivered orders
type DeliveredOrder = {
  id: string;
  driverName: string;
  companyAddress: string;
  deliveryAddress: string;
  deliveredAt: string;
  status: string;
};

export default function OrdersCompleted() {
  const [search, setSearch] = useState<string>("");

  // Static data
  const orders: DeliveredOrder[] = [
    {
      id: "CMD-4501",
      driverName: "Ahmed Ben Ali",
      companyAddress: "Mghira Industrial Zone, Ben Arous",
      deliveryAddress: "Monoprix Lac 2, Tunis",
      deliveredAt: "2025-01-10",
      status: "Delivered",
    },
    {
      id: "CMD-4502",
      driverName: "Sami Trabelsi",
      companyAddress: "Ben Arous Center",
      deliveryAddress: "Géant Tunis City",
      deliveredAt: "2025-01-11",
      status: "Delivered",
    },
    {
      id: "CMD-4503",
      driverName: "Walid Gharbi",
      companyAddress: "Rades Plage",
      deliveryAddress: "Carrefour La Marsa",
      deliveredAt: "2025-01-12",
      status: "Delivered",
    },
  ];

  // Filtering by search input
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.driverName.toLowerCase().includes(search.toLowerCase()) ||
      order.companyAddress.toLowerCase().includes(search.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-yellow-500">Delivered Orders</h1>

      {/* Search bar with clear button */}
      <div className="relative w-72">
        <Input
          placeholder="Search by order, driver, address..."
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

      {/* Orders table */}
      <Card>
        <CardHeader>
          <CardTitle>Delivered Orders List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Company Address</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.driverName}</TableCell>
                  <TableCell>{order.companyAddress}</TableCell>
                  <TableCell>{order.deliveryAddress}</TableCell>
                  <TableCell>{new Date(order.deliveredAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-green-600 font-semibold">{order.status}</TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No orders found
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
