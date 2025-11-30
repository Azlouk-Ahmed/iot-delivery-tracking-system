import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Truck,
  Package,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Box,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { axiosPublic } from "@/api/axios";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetchData";
emailjs.init("5ddo6PQPTT7fIycvW");
type DeliveryStatus =
  | "pending"
  | "in-progress"
  | "delivered"
  | "cancelled"
  | "failed";

interface Client {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface Product {
  product: string;
  qty: number;
  price: number;
}

interface Delivery {
  id: string;
  client: Client;
  status: DeliveryStatus;
  scheduledTime: string;
  items: string;
  notes?: string;
  nombreColis: number;
  products: Product[];
  company: string;
  vehicleId: string;
}

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const {data: reponse, loading} = useFetch("/delivery/driver");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log(reponse)
     if (reponse &&  reponse.success) {
        const mappedDeliveries: Delivery[] = reponse.deliveries.map(
          (d: any) => ({
            id: d._id,
            client: {
              name: d.user?.name || "Unknown",
              phone: d.user?.phone || "N/A",
              email: d.email,
              address: d.user?.address || "Address not provided",
            },
            status: d.status,
            scheduledTime: new Date(d.createdAt).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            items: d.products?.map((p: any) => p.product).join(", ") || "N/A",
            nombreColis:
              d.products?.reduce((sum: number, p: any) => sum + p.qty, 0) || 0,
            products: d.products || [],
            company: d.company?.name || "Unknown",
            vehicleId: d.vehicleId?.plateNumber || d.vehicleId?._id || "N/A",
          })
        );

        setDeliveries(mappedDeliveries);
      }
    
  }, [reponse]);

  const getStatusConfig = (status: DeliveryStatus) => {
    const configs = {
      pending: {
        label: "En attente",
        variant: "secondary" as const,
        icon: Clock,
        color: "text-gray-600",
      },
      "in-progress": {
        label: "En cours",
        variant: "default" as const,
        icon: Truck,
        color: "text-blue-600",
      },
      delivered: {
        label: "Livrée",
        variant: "outline" as const,
        icon: CheckCircle,
        color: "text-green-600",
      },
      cancelled: {
        label: "Annulée",
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
      },
      failed: {
        label: "Échouée",
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-orange-600",
      },
    };
    return configs[status];
  };

  const updateDeliveryStatus = async (
    deliveryId: string,
    newStatus: DeliveryStatus
  ) => {
    try {
      setUpdatingStatus(deliveryId);
      setError(null);
      setSuccessMessage(null);

      const response = await axiosPublic.put(`/delivery/${deliveryId}`, {
        status: newStatus,
      });

      if (response.data.success) {
        setDeliveries(
          deliveries.map((d) =>
            d.id === deliveryId ? { ...d, status: newStatus } : d
          )
        );
        const delivey = deliveries.filter((d) => d.id === deliveryId)[0];
        if (newStatus === "in-progress") {
          await emailjs.send("service_ztho70b", "template_ybf67te", {
            title: "Your Order is ready to be tracked",
            name: "",
            time: new Date().toLocaleString(),
            message:
              "Your delivery is ready to be tracked in real-time using our IoT Delivery Tracking System. " +
              import.meta.env.VITE_CLIENT_URL,
            email: delivey.email,
          });
        }

        toast.success("Statut de livraison mis à jour avec succès");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Échec de la mise à jour du statut de la livraison"
      );
      console.error("Error updating delivery status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Liste des Livraisons ({deliveries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deliveries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune livraison disponible
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Nb Colis</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((delivery) => {
                  const statusConfig = getStatusConfig(delivery.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">
                        {delivery.id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">
                            {delivery.client.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {delivery.client.phone !== "N/A" && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              <span>{delivery.client.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">
                              {delivery.client.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1 max-w-[200px]">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            {delivery.client.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span className="text-sm">{delivery.items}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-center">
                          <Box className="h-4 w-4 text-orange-500" />
                          <span className="font-semibold">
                            {delivery.nombreColis}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{delivery.scheduledTime}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={delivery.status}
                          onValueChange={(value) =>
                            updateDeliveryStatus(
                              delivery.id,
                              value as DeliveryStatus
                            )
                          }
                          disabled={updatingStatus === delivery.id}
                        >
                          <SelectTrigger className="w-[140px]">
                            <div className="flex items-center gap-2">
                              {updatingStatus === delivery.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <StatusIcon
                                  className={`h-4 w-4 ${statusConfig.color}`}
                                />
                              )}
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <div className="flex items-center gap-2">
                                En attente
                              </div>
                            </SelectItem>
                            <SelectItem value="in-progress">
                              <div className="flex items-center gap-2">
                                En cours
                              </div>
                            </SelectItem>
                            <SelectItem value="delivered">
                              <div className="flex items-center gap-2">
                                Livrée
                              </div>
                            </SelectItem>
                            <SelectItem value="cancelled">
                              <div className="flex items-center gap-2">
                                Annulée
                              </div>
                            </SelectItem>
                            <SelectItem value="failed">
                              <div className="flex items-center gap-2">
                                Échouée
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Deliveries;
