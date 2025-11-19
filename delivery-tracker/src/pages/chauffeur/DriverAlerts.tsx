import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Package, CheckCircle, XCircle, Trash2, Clock, User, MapPin } from 'lucide-react';

// Types d'alertes
type AlertType = 'delivery_added' | 'delivery_declined' | 'delivery_deleted' | 'delivery_modified';
type AlertStatus = 'unread' | 'read';

interface Alert {
    id: string;
    type: AlertType;
    title: string;
    message: string;
    clientName: string;
    deliveryId: string;
    address: string;
    timestamp: string;
    status: AlertStatus;
}

// Données simulées d'alertes
const MOCK_ALERTS: Alert[] = [
    {
        id: 'ALT001',
        type: 'delivery_added',
        title: 'Nouvelle livraison ajoutée',
        message: 'Une nouvelle livraison a été assignée à votre véhicule',
        clientName: 'Sophie Martin',
        deliveryId: 'DEL123',
        address: '15 Avenue Habib Bourguiba, Tunis',
        timestamp: '2025-11-13 14:30',
        status: 'unread'
    },
    {
        id: 'ALT002',
        type: 'delivery_added',
        title: 'Nouvelle livraison ajoutée',
        message: 'Une nouvelle livraison urgente a été assignée',
        clientName: 'Ahmed Ben Ali',
        deliveryId: 'DEL124',
        address: '22 Avenue Mohamed V, La Marsa',
        timestamp: '2025-11-13 13:15',
        status: 'unread'
    },
    {
        id: 'ALT003',
        type: 'delivery_declined',
        title: 'Livraison refusée',
        message: 'La livraison a été refusée par le client',
        clientName: 'Karim Bouzid',
        deliveryId: 'DEL120',
        address: '33 Avenue Farhat Hached, Ben Arous',
        timestamp: '2025-11-13 11:45',
        status: 'read'
    },
    {
        id: 'ALT004',
        type: 'delivery_deleted',
        title: 'Livraison supprimée',
        message: "L'administrateur a supprimé une livraison de votre planning",
        clientName: 'Fatma Trabelsi',
        deliveryId: 'DEL119',
        address: '45 Rue Ibn Khaldoun, Carthage',
        timestamp: '2025-11-13 10:20',
        status: 'read'
    },
    {
        id: 'ALT005',
        type: 'delivery_modified',
        title: 'Livraison modifiée',
        message: "L'heure de livraison a été modifiée",
        clientName: 'Mohamed Gharbi',
        deliveryId: 'DEL118',
        address: '88 Avenue de la République, Ariana',
        timestamp: '2025-11-13 09:00',
        status: 'read'
    },
    {
        id: 'ALT006',
        type: 'delivery_added',
        title: 'Nouvelle livraison ajoutée',
        message: 'Livraison planifiée pour demain matin',
        clientName: 'Leila Mansour',
        deliveryId: 'DEL125',
        address: '12 Rue du Pacha, Sidi Bou Said',
        timestamp: '2025-11-12 16:30',
        status: 'read'
    }
];

const DriverAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const getAlertIcon = (type: AlertType) => {
        switch (type) {
            case 'delivery_added':
                return <Package className="w-5 h-5 text-green-400" />;
            case 'delivery_declined':
                return <XCircle className="w-5 h-5 text-red-400" />;
            case 'delivery_deleted':
                return <Trash2 className="w-5 h-5 text-orange-400" />;
            case 'delivery_modified':
                return <CheckCircle className="w-5 h-5 text-blue-400" />;
        }
    };

    const getAlertColor = (type: AlertType) => {
        switch (type) {
            case 'delivery_added':
                return 'bg-green-500/10 border-green-500/30';
            case 'delivery_declined':
                return 'bg-red-500/10 border-red-500/30';
            case 'delivery_deleted':
                return 'bg-orange-500/10 border-orange-500/30';
            case 'delivery_modified':
                return 'bg-blue-500/10 border-blue-500/30';
        }
    };

    const markAsRead = (alertId: string) => {
        setAlerts(alerts.map(alert =>
            alert.id === alertId ? { ...alert, status: 'read' as AlertStatus } : alert
        ));
    };

    const markAllAsRead = () => {
        setAlerts(alerts.map(alert => ({ ...alert, status: 'read' as AlertStatus })));
    };

    const deleteAlert = (alertId: string) => {
        setAlerts(alerts.filter(alert => alert.id !== alertId));
    };

    const filteredAlerts = filter === 'all'
        ? alerts
        : alerts.filter(alert => alert.status === 'unread');

    const unreadCount = alerts.filter(alert => alert.status === 'unread').length;

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6">
            <div className="max-w-5xl mx-auto">
                {/* En-tête */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                            <Bell className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Mes Alertes</h1>
                            <p className="text-gray-400">Notifications de l'administrateur</p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-[#1a1a1a] border-gray-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/20 p-3 rounded-lg">
                                    <Bell className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{alerts.length}</p>
                                    <p className="text-sm text-gray-400">Total d'alertes</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#1a1a1a] border-gray-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-500/20 p-3 rounded-lg">
                                    <Bell className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{unreadCount}</p>
                                    <p className="text-sm text-gray-400">Non lues</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#1a1a1a] border-gray-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-500/20 p-3 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{alerts.length - unreadCount}</p>
                                    <p className="text-sm text-gray-400">Lues</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtres et actions */}
                <Card className="bg-[#1a1a1a] border-gray-800 mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setFilter('all')}
                                    variant={filter === 'all' ? 'default' : 'outline'}
                                    className={filter === 'all' ? 'bg-blue-600' : 'border-gray-700 text-gray-300'}
                                >
                                    Toutes ({alerts.length})
                                </Button>
                                <Button
                                    onClick={() => setFilter('unread')}
                                    variant={filter === 'unread' ? 'default' : 'outline'}
                                    className={filter === 'unread' ? 'bg-red-600' : 'border-gray-700 text-gray-300'}
                                >
                                    Non lues ({unreadCount})
                                </Button>
                            </div>
                            {unreadCount > 0 && (
                                <Button
                                    onClick={markAllAsRead}
                                    variant="outline"
                                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Tout marquer comme lu
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Liste des alertes */}
                <div className="space-y-4">
                    {filteredAlerts.length === 0 ? (
                        <Card className="bg-[#1a1a1a] border-gray-800">
                            <CardContent className="p-12 text-center">
                                <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">Aucune alerte à afficher</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredAlerts.map((alert) => (
                            <Card
                                key={alert.id}
                                className={`bg-[#1a1a1a] border-gray-800 transition-all hover:shadow-lg ${alert.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''
                                    }`}
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-4 flex-1">
                                            {/* Icône d'alerte */}
                                            <div className={`p-3 rounded-lg ${getAlertColor(alert.type)} border`}>
                                                {getAlertIcon(alert.type)}
                                            </div>

                                            {/* Contenu de l'alerte */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                                                        <p className="text-sm text-gray-400 mt-1">{alert.message}</p>
                                                    </div>
                                                    {alert.status === 'unread' && (
                                                        <Badge className="bg-red-500 text-white">Nouveau</Badge>
                                                    )}
                                                </div>

                                                {/* Détails de la livraison */}
                                                <div className="grid md:grid-cols-2 gap-3">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <User className="w-4 h-4 text-gray-500" />
                                                        <span className="text-gray-400">Client:</span>
                                                        <span className="text-gray-300 font-medium">{alert.clientName}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Package className="w-4 h-4 text-gray-500" />
                                                        <span className="text-gray-400">Livraison:</span>
                                                        <span className="text-gray-300 font-mono">{alert.deliveryId}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm md:col-span-2">
                                                        <MapPin className="w-4 h-4 text-gray-500" />
                                                        <span className="text-gray-400">Adresse:</span>
                                                        <span className="text-gray-300">{alert.address}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className="w-4 h-4 text-gray-500" />
                                                        <span className="text-gray-400">{alert.timestamp}</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-2">
                                                    {alert.status === 'unread' && (
                                                        <Button
                                                            onClick={() => markAsRead(alert.id)}
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Marquer comme lu
                                                        </Button>
                                                    )}
                                                    <Button
                                                        onClick={() => deleteAlert(alert.id)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Supprimer
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverAlerts;