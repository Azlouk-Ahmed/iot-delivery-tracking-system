import { useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
    Navigation,
    Camera,
    FileText,
    Info,
    Box
} from 'lucide-react';

// Types
type DeliveryStatus = 'en_attente' | 'en_cours' | 'livree' | 'annulee';

interface Client {
    name: string;
    phone: string;
    email: string;
    address: string;
}

interface Delivery {
    id: string;
    client: Client;
    status: DeliveryStatus;
    scheduledTime: string;
    items: string;
    notes?: string;
    signatureUrl?: string;
    photoUrl?: string;
    nombreColis: number;
}

const Deliveries = () => {
    // TODO: Replace with real data from your context/API
    const driver = {
        name: 'Jean Dupont',
        id: 'DRV123',
        vehicleId: 'VEH456'
    };

    const [deliveries, setDeliveries] = useState<Delivery[]>([
        {
            id: 'DEL001',
            client: {
                name: 'Marie Martin',
                phone: '+216 20 123 456',
                email: 'marie.martin@email.com',
                address: '12 Rue de la Paix, Tunis 1000'
            },
            status: 'en_cours',
            scheduledTime: '10:00',
            items: 'Colis fragile - 2.5kg',
            notes: 'Sonner deux fois',
            nombreColis: 3
        },
        {
            id: 'DEL002',
            client: {
                name: 'Ahmed Ben Ali',
                phone: '+216 22 456 789',
                email: 'ahmed.benali@email.com',
                address: '45 Avenue Habib Bourguiba, Tunis 1001'
            },
            status: 'en_attente',
            scheduledTime: '11:30',
            items: 'Documents - 0.5kg',
            nombreColis: 1
        },
        {
            id: 'DEL003',
            client: {
                name: 'Sophie Dubois',
                phone: '+216 98 765 432',
                email: 'sophie.dubois@email.com',
                address: '78 Rue de Marseille, Tunis 1002'
            },
            status: 'livree',
            scheduledTime: '09:30',
            items: 'Électronique - 1.2kg',
            signatureUrl: '/signature.png',
            nombreColis: 2
        },
    ]);

    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [showNotesDialog, setShowNotesDialog] = useState(false);
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);
    const [deliveryNotes, setDeliveryNotes] = useState('');

    const getStatusConfig = (status: DeliveryStatus) => {
        const configs = {
            en_attente: {
                label: 'En attente',
                variant: 'secondary' as const,
                icon: Clock,
                color: ''
            },
            en_cours: {
                label: 'En cours',
                variant: 'default' as const,
                icon: Truck,
                color: 'text-blue-600'
            },
            livree: {
                label: 'Livrée',
                variant: 'outline' as const,
                icon: CheckCircle,
                color: 'text-green-600'
            },
            annulee: {
                label: 'Annulée',
                variant: 'destructive' as const,
                icon: XCircle,
                color: 'text-red-600'
            },
        };
        return configs[status];
    };

    const updateDeliveryStatus = (deliveryId: string, newStatus: DeliveryStatus) => {
        setDeliveries(deliveries.map(d =>
            d.id === deliveryId ? { ...d, status: newStatus } : d
        ));
    };

    const handleCompleteDelivery = () => {
        if (selectedDelivery) {
            updateDeliveryStatus(selectedDelivery.id, 'livree');
            // TODO: Upload signature, photo, and notes to backend
            setShowCompleteDialog(false);
            setSelectedDelivery(null);
            setDeliveryNotes('');
        }
    };

    const openNavigationApp = (address: string) => {
        // Opens Google Maps or default navigation app
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };

    const handleShowNotes = (delivery: Delivery) => {
        setSelectedDelivery(delivery);
        setShowNotesDialog(true);
    };

    const handleShowDetails = (delivery: Delivery) => {
        setSelectedDelivery(delivery);
        setShowDetailsDialog(true);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Driver Info Header */}
            <Card className="mb-6 ">
                <CardHeader>
                    <CardTitle className="text-2xl">Gestion des Livraisons</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3">
                            <div className=" p-3 rounded-lg">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm opacity-90">Nom du chauffeur</p>
                                <p className="text-lg font-semibold">{driver.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className=" p-3 rounded-lg">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm opacity-90">ID chauffeur</p>
                                <p className="text-lg font-semibold">{driver.id}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className=" p-3 rounded-lg">
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

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(['en_attente', 'en_cours', 'livree', 'annulee'] as DeliveryStatus[]).map(status => {
                    const config = getStatusConfig(status);
                    const count = deliveries.filter(d => d.status === status).length;
                    const Icon = config.icon;

                    return (
                        <Card key={status}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm ">{config.label}</p>
                                        <p className="text-2xl font-bold">{count}</p>
                                    </div>
                                    <Icon className={`h-8 w-8 ${config.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Deliveries Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Liste des Livraisons
                    </CardTitle>
                </CardHeader>
                <CardContent>
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
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deliveries.map((delivery) => {
                                const statusConfig = getStatusConfig(delivery.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <TableRow key={delivery.id}>
                                        <TableCell className="font-medium">{delivery.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 " />
                                                <span className="font-medium">{delivery.client.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Phone className="h-3 w-3 " />
                                                    <span>{delivery.client.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm ">
                                                    <Mail className="h-3 w-3 " />
                                                    <span className="truncate max-w-[150px]">{delivery.client.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-start gap-1 max-w-[200px]">
                                                <MapPin className="h-4 w-4  mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">{delivery.client.address}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 " />
                                                <span className="text-sm">{delivery.items}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 justify-center">
                                                <Box className="h-4 w-4 text-orange-500" />
                                                <span className="font-semibold">{delivery.nombreColis}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4 " />
                                                <span>{delivery.scheduledTime}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={delivery.status}
                                                onValueChange={(value) => updateDeliveryStatus(delivery.id, value as DeliveryStatus)}
                                            >
                                                <SelectTrigger className="w-[140px]">
                                                    <div className="flex items-center gap-2">
                                                        <StatusIcon className="h-4 w-4" />
                                                        <SelectValue />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en_attente">
                                                        <div className="flex items-center gap-2">
                                                            En attente
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="en_cours">
                                                        <div className="flex items-center gap-2">
                                                            En cours
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="livree">
                                                        <div className="flex items-center gap-2">
                                                            Livrée
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="annulee">
                                                        <div className="flex items-center gap-2">
                                                            Annulée
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleShowDetails(delivery)}
                                                >
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    Détails
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openNavigationApp(delivery.client.address)}
                                                >
                                                    <Navigation className="h-4 w-4" />
                                                </Button>
                                                {delivery.status === 'en_cours' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedDelivery(delivery);
                                                            setShowCompleteDialog(true);
                                                        }}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Terminer
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Delivery Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Détails de la livraison {selectedDelivery?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedDelivery && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-semibold">Client</Label>
                                    <p>{selectedDelivery.client.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold">Téléphone</Label>
                                    <p>{selectedDelivery.client.phone}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-sm font-semibold">Adresse</Label>
                                    <p>{selectedDelivery.client.address}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold">Heure prévue</Label>
                                    <p>{selectedDelivery.scheduledTime}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold">Statut</Label>
                                    <Badge variant={getStatusConfig(selectedDelivery.status).variant}>
                                        {getStatusConfig(selectedDelivery.status).label}
                                    </Badge>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold">Nombre de colis</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Box className="h-5 w-5 text-orange-500" />
                                        <span className="text-lg font-bold">{selectedDelivery.nombreColis}</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-sm font-semibold">Articles</Label>
                                    <p>{selectedDelivery.items}</p>
                                </div>
                                {selectedDelivery.notes && (
                                    <div className="col-span-2">
                                        <Label className="text-sm font-semibold">Notes</Label>
                                        <p className="text-sm  bg-gray-50 p-3 rounded-lg">{selectedDelivery.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>



            {/* Complete Delivery Dialog */}
            <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Terminer la livraison</DialogTitle>
                        <DialogDescription>
                            Veuillez confirmer la livraison et ajouter les détails nécessaires
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
                            Annuler
                        </Button>
                        <Button onClick={handleCompleteDelivery}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Deliveries;