import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, PackageOpen, Truck, User, Phone } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useNavigate } from 'react-router-dom';

export default function ClientDashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Example orders (replace later with data from your backend)
  const orders = [
    { id: "CMD-4521", status: "In delivery", delivered: false },
    { id: "CMD-4510", status: "Delivered yesterday", delivered: false },
    { id: "CMD-4502", status: "Delivered 2 days ago", delivered: true },
    { id: "CMD-4490", status: "Delivered 4 days ago", delivered: true },
    { id: "CMD-4485", status: "Delivered last week", delivered: true },
    { id: "CMD-4479", status: "Delivered last week", delivered: true },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
         <h1 className="text-3xl font-bold text-yellow-500">
            Welcome, {user?.name || "Client"}
          </h1>
          <p className="text-sm text-gray-500">Track your orders and deliveries in real time</p>
        </div>
        <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
          Refresh
        </Button>
      </div>

      {/* Ongoing Delivery */}
      <Card className="border-yellow-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" /> Ongoing Delivery
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="flex items-center gap-2 p-3">
            <User className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Driver</p>
              <p className="font-semibold">Ahmed Ben Ali</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3">
            <Phone className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">+216 98 765 432</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3">
            <Truck className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Vehicle</p>
              <p className="font-semibold">Truck 12</p>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Order History
          </CardTitle>
        </CardHeader>
        <CardContent>

          <div className="space-y-4">
            {orders.slice(-5).map((order) => (
              <div
                key={order.id}
                className={`flex items-center justify-between gap-4 border-l-4 pl-4 ${
                  order.delivered ? "border-gray-300" : "border-yellow-400"
                }`}
              >
                <div className="flex items-center gap-4">
                  <PackageOpen className={order.delivered ? "text-gray-500" : "text-yellow-600"} />
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.status}</p>
                  </div>
                </div>

                {order.delivered ? (
                  <Button size="sm" variant="outline" onClick={()=>{navigate('/orders/history')}}>
                    View details
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      const el = document.getElementById("map-section");
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    Track
                  </Button>
                )}
              </div>
            ))}
          </div>

        </CardContent>
      </Card>

      {/* Map */}
      <div id="map-section" className="mt-8">
        <Card className="h-72 flex items-center justify-center border-dashed border-2 text-gray-500">
          <p>🗺️ Real-time tracking map</p>
        </Card>
      </div>

    </div>
  );
}


