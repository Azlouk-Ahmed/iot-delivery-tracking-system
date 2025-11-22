import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Truck, Package, MapPin, Clock } from 'lucide-react';

// Types
interface Delivery {
  id: string;
  recipient: string;
  address: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  scheduledTime: string;
  distance: string;
}

function DriverHome() {
  // TODO: Replace with real data from your context/API
  const driver = {
    name: 'Jean Dupont',
    id: 'DRV123',
    vehicleId: 'VEH456'
  };

  // TODO: Replace with real deliveries data from your API
  const deliveries: Delivery[] = [
    {
      id: 'DEL001',
      recipient: 'Marie Martin',
      address: '12 Rue de la Paix, Tunis',
      status: 'pending',
      priority: 'high',
      scheduledTime: '10:00',
      distance: '3.2 km'
    },
    {
      id: 'DEL002',
      recipient: 'Ahmed Ben Ali',
      address: '45 Avenue Habib Bourguiba, Tunis',
      status: 'pending',
      priority: 'medium',
      scheduledTime: '11:30',
      distance: '5.8 km'
    },
    {
      id: 'DEL003',
      recipient: 'Sophie Dubois',
      address: '78 Rue de Marseille, Tunis',
      status: 'in_progress',
      priority: 'high',
      scheduledTime: '09:30',
      distance: '1.5 km'
    },
    {
      id: 'DEL004',
      recipient: 'Karim Gharbi',
      address: '23 Boulevard Mohamed V, Tunis',
      status: 'pending',
      priority: 'low',
      scheduledTime: '14:00',
      distance: '7.3 km'
    },
  ];

  const getStatusBadge = (status: Delivery['status']) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      in_progress: { label: 'En cours', variant: 'default' as const },
      completed: { label: 'Livrée', variant: 'outline' as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: Delivery['priority']) => {
    const priorityConfig = {
      high: { label: 'Urgent', className: 'bg-red-500 hover:bg-red-600' },
      medium: { label: 'Moyen', className: 'bg-orange-500 hover:bg-orange-600' },
      low: { label: 'Faible', className: 'bg-green-500 hover:bg-green-600' },
    };

    const config = priorityConfig[priority];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Driver Info Header */}
      <Card className="mb-6 ">
        <CardHeader>
          <CardTitle className="text-2xl">Tableau de bord Chauffeur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">Nom du chauffeur</p>
                <p className="text-lg font-semibold">{driver.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">ID chauffeur</p>
                <p className="text-lg font-semibold">{driver.id}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">ID véhicule</p>
                <p className="text-lg font-semibold">{driver.vehicleId}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Livraisons à effectuer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Destinataire</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Heure prévue</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.id}</TableCell>
                  <TableCell>{delivery.recipient}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{delivery.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{delivery.scheduledTime}</span>
                    </div>
                  </TableCell>
                  <TableCell>{delivery.distance}</TableCell>
                  <TableCell>{getPriorityBadge(delivery.priority)}</TableCell>
                  <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // TODO: Navigate to delivery details
                          console.log('View details:', delivery.id);
                        }}
                      >
                        Détails
                      </Button>
                      {delivery.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            // TODO: Start delivery
                            console.log('Start delivery:', delivery.id);
                          }}
                        >
                          Démarrer
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default DriverHome;