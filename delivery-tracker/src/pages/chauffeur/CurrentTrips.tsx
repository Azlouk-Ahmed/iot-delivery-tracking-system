import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Truck, User, Phone, Package, Navigation } from 'lucide-react';

// Données du trajet en cours
const CURRENT_TRIP = {
  id: 'TRJ001',
  driver: 'Jean Dupont',
  driverId: 'DRV123',
  vehicleId: 'VEH456',
  client: {
    name: 'Sophie Martin',
    phone: '+216 98 765 432',
    address: '15 Avenue Habib Bourguiba, Tunis',
    coordinates: { lat: 36.8065, lng: 10.1815 }
  },
  vehiclePosition: { lat: 36.8000, lng: 10.1700 },
  status: 'almost_there', // almost_there, still_away, waiting
  estimatedArrival: '10 min',
  distance: '2.5 km',
  startTime: '14:30',
  packageDetails: 'Colis standard - 5kg',
  nombreCommande: '2 commandes',

};

type TripStatus = 'almost_there' | 'still_away' | 'waiting';

const CurrentTrips = () => {
  const [tripStatus, setTripStatus] = useState<TripStatus>(CURRENT_TRIP.status as TripStatus);

  const getStatusInfo = (status: TripStatus) => {
    const statusMap: Record<TripStatus, { label: string; color: string; textColor: string; bgColor: string }> = {
      almost_there: {
        label: 'Presque arrivé',
        color: 'bg-green-500',
        textColor: 'text-green-400',
        bgColor: 'bg-green-500/10'
      },
      still_away: {
        label: 'En route',
        color: 'bg-blue-500',
        textColor: 'text-blue-400',
        bgColor: 'bg-blue-500/10'
      },
      waiting: {
        label: "J'attends...",
        color: 'bg-orange-500',
        textColor: 'text-orange-400',
        bgColor: 'bg-orange-500/10'
      }
    };
    return statusMap[status] || statusMap.waiting;
  };

  const sendNotification = () => {
    alert(`✅ Notification envoyée à ${CURRENT_TRIP.client.name}\n\n"Votre chauffeur arrive dans ${CURRENT_TRIP.estimatedArrival}"`);
  };

  // Simulation de mise à jour de position
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: TripStatus[] = ['still_away', 'almost_there', 'waiting'];
      const currentIndex = statuses.indexOf(tripStatus);
      const nextIndex = (currentIndex + 1) % statuses.length;
      setTripStatus(statuses[nextIndex]);
    }, 8000);

    return () => clearInterval(interval);
  }, [tripStatus]);

  const currentStatus = getStatusInfo(tripStatus);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <Card className="mb-6 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Trajet en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-lg">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Nom du chauffeur</p>
                  <p className="text-lg font-semibold">{CURRENT_TRIP.driver}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">ID chauffeur</p>
                  <p className="text-lg font-semibold">{CURRENT_TRIP.driverId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">ID véhicule</p>
                  <p className="text-lg font-semibold">{CURRENT_TRIP.vehicleId}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barre de statut */}
        <Card className={`${currentStatus.bgColor} border-2 border-gray-800 mb-6 bg-[#1a1a1a]`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-5 h-5 ${currentStatus.color} rounded-full animate-pulse`}></div>
                <div>
                  <p className={`text-2xl font-bold ${currentStatus.textColor}`}>
                    {currentStatus.label}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Arrivée estimée: {CURRENT_TRIP.estimatedArrival} • Distance: {CURRENT_TRIP.distance}
                  </p>
                </div>
              </div>
              <Button onClick={sendNotification} className="flex items-center gap-2 w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Package className="w-4 h-4" />
                Notifier le client
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Carte de localisation */}
          <Card className="lg:col-span-1 bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5" />
                Position en temps réel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-[#0f0f0f] rounded-lg overflow-hidden border border-gray-800">
                <div className="absolute inset-0">
                  {/* Grille de carte simulée */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(#1f1f1f 1px, transparent 1px), linear-gradient(90deg, #1f1f1f 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* Position du véhicule */}
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="relative">
                      <div className={`absolute -inset-4 ${currentStatus.color} opacity-20 rounded-full animate-ping`}></div>
                      <Navigation className={`w-10 h-10 ${currentStatus.color.replace('bg-', 'text-')} relative z-10`} style={{ transform: 'rotate(45deg)' }} />
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        🚗 Véhicule {CURRENT_TRIP.vehicleId}
                      </div>
                    </div>
                  </div>

                  {/* Position du client */}
                  <div className="absolute bottom-1/4 right-1/3 transform translate-x-1/2 translate-y-1/2 z-10">
                    <div className="relative">
                      <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" />
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        📍 Client
                      </div>
                    </div>
                  </div>

                  {/* Ligne de trajet animée */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    <line
                      x1="50%"
                      y1="33%"
                      x2="66%"
                      y2="75%"
                      stroke="url(#lineGradient)"
                      strokeWidth="4"
                      strokeDasharray="10,5"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">📍 Position véhicule:</span>
                  <span className="font-mono text-xs bg-[#0f0f0f] text-gray-300 px-2 py-1 rounded border border-gray-800">
                    {CURRENT_TRIP.vehiclePosition.lat.toFixed(4)}, {CURRENT_TRIP.vehiclePosition.lng.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">🎯 Destination:</span>
                  <span className="font-mono text-xs bg-[#0f0f0f] text-gray-300 px-2 py-1 rounded border border-gray-800">
                    {CURRENT_TRIP.client.coordinates.lat.toFixed(4)}, {CURRENT_TRIP.client.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations client et livraison */}
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-5 h-5" />
                Informations de livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-lg text-white">{CURRENT_TRIP.client.name}</p>
                    <p className="text-sm text-gray-400">Client</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-white">{CURRENT_TRIP.client.phone}</p>
                    <p className="text-sm text-gray-400">Téléphone</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-white">{CURRENT_TRIP.client.address}</p>
                    <p className="text-sm text-gray-400">Adresse de livraison</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
                  <Package className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-white">{CURRENT_TRIP.packageDetails}</p>
                    <p className="text-sm text-gray-400">Détails du colis</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
                  <Package className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-white">{CURRENT_TRIP.nombreCommande}</p>
                    <p className="text-sm text-gray-400">Nombre des commandes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-white">Départ: {CURRENT_TRIP.startTime}</p>
                    <p className="text-sm text-gray-400">Heure de début du trajet</p>
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white">Progression de la livraison</span>
                  <span className="text-sm font-bold text-gray-300">75%</span>
                </div>
                <div className="w-full bg-[#0f0f0f] rounded-full h-4 overflow-hidden border border-gray-800">
                  <div
                    className={`${currentStatus.color} h-4 rounded-full transition-all duration-1000 flex items-center justify-end pr-2`}
                    style={{ width: '75%' }}
                  >
                    <span className="text-white text-xs font-bold">●</span>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Départ</span>
                  <span>En cours</span>
                  <span>Arrivée</span>
                </div>
              </div>

              {/* Badge du trajet */}
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">ID Trajet:</span>
                  <Badge variant="outline" className="font-mono border-gray-700 text-gray-300">{CURRENT_TRIP.id}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CurrentTrips;