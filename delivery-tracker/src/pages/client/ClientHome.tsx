import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, PackageOpen } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useFetch from "@/hooks/useFetchData";

export default function ClientDashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const { data } = useFetch("/delivery/all", { immediate: true });

  const deliveries = data?.deliveries || [];

  // Convert to UI order format
  const orders = deliveries.map((d: any) => ({
    id: d._id,
    status: d.status,
    delivered: d.status === "delivered",  // You can adjust this based on your API
    createdAt: d.createdAt
  }));

  return (
    <div className="flex flex-col gap-6 p-6">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Order History
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {orders.length === 0 && (
              <p className="text-sm text-muted-foreground">No deliveries found.</p>
            )}

            {orders.slice(-5).map((order) => (
              <div
                key={order.id}
                className={`flex items-center justify-between gap-4 border-l-4 pl-4 ${
                  order.delivered ? "border-gray-300" : "border-yellow-400"
                }`}
              >
                <div className="flex items-center gap-4">
                  <PackageOpen
                    className={
                      order.delivered ? "text-gray-500" : "text-yellow-600"
                    }
                  />
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-sm text-gray-500">
                      Status: {order.status}
                    </p>
                  </div>
                </div>

                {order.delivered ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigate("/orders/history");
                    }}
                  >
                    View details
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      const el = document.getElementById("map-section");
                      el?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
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
    </div>
  );
}
