import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, MapPin, Truck } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ----------------------
// Types
// ----------------------
interface LocationPoint {
  lat: number;
  lng: number;
  name: string;
}

interface Order {
  id: string;
  status: string;
  origin: LocationPoint;
  destination: LocationPoint;
  currentLocation: LocationPoint;
  estimatedDelivery: string;
}

// Fake order data
const orders: Record<string, Order> = {
  ORD001: {
    id: "ORD001",
    status: "In Transit",
    origin: { lat: 40.7128, lng: -74.006, name: "New York, NY" },
    destination: { lat: 34.0522, lng: -118.2437, name: "Los Angeles, CA" },
    currentLocation: { lat: 39.7392, lng: -104.9903, name: "Denver, CO" },
    estimatedDelivery: "2024-11-25",
  },
  ORD002: {
    id: "ORD002",
    status: "Delivered",
    origin: { lat: 41.8781, lng: -87.6298, name: "Chicago, IL" },
    destination: { lat: 29.7604, lng: -95.3698, name: "Houston, TX" },
    currentLocation: { lat: 29.7604, lng: -95.3698, name: "Houston, TX" },
    estimatedDelivery: "2024-11-20",
  },
  ORD003: {
    id: "ORD003",
    status: "Processing",
    origin: { lat: 47.6062, lng: -122.3321, name: "Seattle, WA" },
    destination: { lat: 37.7749, lng: -122.4194, name: "San Francisco, CA" },
    currentLocation: { lat: 47.6062, lng: -122.3321, name: "Seattle, WA" },
    estimatedDelivery: "2024-11-26",
  },
};

const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Fetching order details...");

    setTimeout(() => {
      const order = orders[orderId.toUpperCase()];
      if (order) {
        setOrderData(order);
        toast.success("Order found successfully!", { id: toastId });
      } else {
        setOrderData(null);
        toast.error("Order not found. Try ORD001, ORD002, or ORD003", {
          id: toastId,
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleTrackOrder();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your order ID to view real-time tracking information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
            <CardDescription>
              Enter your order ID (e.g., ORD001, ORD002, or ORD003)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleTrackOrder} disabled={isLoading}>
                <Package className="mr-2 h-4 w-4" />
                Track Order
              </Button>
            </div>
          </CardContent>
        </Card>

        {orderData && (
          <>
            {/* MAP CARD */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking Map</CardTitle>
                <CardDescription>
                  View your order's journey on the map
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="h-[500px] rounded-lg overflow-hidden border">
                  <MapContainer
                    center={[
                      orderData.currentLocation.lat,
                      orderData.currentLocation.lng,
                    ]}
                    zoom={4}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Polyline
                      positions={[
                        [orderData.origin.lat, orderData.origin.lng],
                        [
                          orderData.currentLocation.lat,
                          orderData.currentLocation.lng,
                        ],
                        [
                          orderData.destination.lat,
                          orderData.destination.lng,
                        ],
                      ]}
                      pathOptions={{
                        color: "blue",
                        weight: 3,
                        opacity: 0.6,
                        dashArray: "10, 10",
                      }}
                    />

                    <Marker
                      position={[orderData.origin.lat, orderData.origin.lng]}
                    >
                      <Popup>
                        <strong>Origin</strong>
                        <br />
                        {orderData.origin.name}
                      </Popup>
                    </Marker>

                    <Marker
                      position={[
                        orderData.currentLocation.lat,
                        orderData.currentLocation.lng,
                      ]}
                    >
                      <Popup>
                        <strong>Current Location</strong>
                        <br />
                        {orderData.currentLocation.name}
                      </Popup>
                    </Marker>

                    <Marker
                      position={[
                        orderData.destination.lat,
                        orderData.destination.lng,
                      ]}
                    >
                      <Popup>
                        <strong>Destination</strong>
                        <br />
                        {orderData.destination.name}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </CardContent>
            </Card>

            {/* ORDER DETAILS CARD */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Order ID</p>
                      <p className="text-sm text-muted-foreground">
                        {orderData.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-muted-foreground">
                        {orderData.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Estimated Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        {orderData.estimatedDelivery}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Origin:</span>
                    <span className="text-muted-foreground">
                      {orderData.origin.name}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Current Location:</span>
                    <span className="text-muted-foreground">
                      {orderData.currentLocation.name}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Destination:</span>
                    <span className="text-muted-foreground">
                      {orderData.destination.name}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
