import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, Calendar, Navigation, Phone, Package, Truck, Box } from 'lucide-react';

// Données du trajet en cours
const driver = {
  id: 'TRJ001',
  driver: 'Jean Dupont',
  driverId: 'DRV123',
  vehicleId: 'VEH456',

};// Données des trajets planifiés
const PLANNED_TRIPS = [
  {
    id: 'TRJ002',
    date: '2025-11-11',
    time: '16:00',
    client: {
      name: 'Ahmed Ben Ali',
      phone: '+216 98 123 456'
    },
    departure: '5 Rue de la Liberté, Tunis',
    arrival: '22 Avenue Mohamed V, La Marsa',
    status: 'scheduled',
    estimatedDuration: '35 min',
    distance: '12 km',
    packageDetails: 'Colis express - 3kg',
    nombreCommande: '3 commandes',
  },
  {
    id: 'TRJ003',
    date: '2025-11-12',
    time: '09:00',
    client: {
      name: 'Fatma Trabelsi',
      phone: '+216 97 654 321'
    },
    departure: 'Centre Commercial Carrefour, Tunis',
    arrival: '45 Rue Ibn Khaldoun, Carthage',
    status: 'scheduled',
    estimatedDuration: '25 min',
    distance: '8 km',
    packageDetails: 'Colis standard - 7kg',
    nombreCommande: '1 commande',
  },
  {
    id: 'TRJ004',
    date: '2025-11-12',
    time: '14:30',
    client: {
      name: 'Mohamed Gharbi',
      phone: '+216 22 987 654'
    },
    departure: 'Aéroport Tunis-Carthage',
    arrival: '88 Avenue de la République, Ariana',
    status: 'scheduled',
    estimatedDuration: '40 min',
    distance: '15 km',
    packageDetails: 'Bagage - 20kg',
    nombreCommande: '4 commandes',
  },
  {
    id: 'TRJ005',
    date: '2025-11-13',
    time: '10:15',
    client: {
      name: 'Leila Mansour',
      phone: '+216 55 234 567'
    },
    departure: 'Port de La Goulette',
    arrival: '12 Rue du Pacha, Sidi Bou Said',
    status: 'scheduled',
    estimatedDuration: '20 min',
    distance: '6 km',
    packageDetails: 'Colis fragile - 2kg',
    nombreCommande: '2 commandes',
  },
  {
    id: 'TRJ006',
    date: '2025-11-13',
    time: '16:45',
    client: {
      name: 'Karim Bouzid',
      phone: '+216 29 876 543'
    },
    departure: 'Gare de Tunis',
    arrival: '33 Avenue Farhat Hached, Ben Arous',
    status: 'scheduled',
    estimatedDuration: '30 min',
    distance: '10 km',
    packageDetails: 'Documents - 0.5kg',
    nombreCommande: '5 commandes',
  }
];

type Trip = typeof PLANNED_TRIPS[0];

const UpcommingTrips = () => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupTripsByDate = () => {
    const grouped: Record<string, Trip[]> = {};
    PLANNED_TRIPS.forEach(trip => {
      if (!grouped[trip.date]) {
        grouped[trip.date] = [];
      }
      grouped[trip.date].push(trip);
    });
    return grouped;
  };

  const groupedTrips = groupTripsByDate();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <Card className="mb-6 ">
          <CardHeader>
            <CardTitle className="text-2xl">Trajets planifiés</CardTitle>
            <p className="">Vos livraisons à venir organisées par jour</p>

          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className=" p-3 rounded-lg">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Nom du chauffeur</p>
                  <p className="text-lg font-semibold">{driver.driver}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className=" p-3 rounded-lg">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">ID chauffeur</p>
                  <p className="text-lg font-semibold">{driver.driverId}</p>
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

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className=" ">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className=" p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold ">{PLANNED_TRIPS.length}</p>
                  <p className="text-sm ">Trajets planifiés</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className=" ">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className=" p-3 rounded-lg">
                  <Package className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold ">
                    {PLANNED_TRIPS.reduce((sum, trip) => {
                      const commandeCount = parseInt(trip.nombreCommande.split(' ')[0]);
                      return sum + commandeCount;
                    }, 0)}
                  </p>
                  <p className="text-sm ">Commandes à livrer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className=" ">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <Navigation className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold ">
                    {PLANNED_TRIPS.reduce((sum, trip) => sum + parseInt(trip.distance), 0)} km
                  </p>
                  <p className="text-sm ">Distance totale</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className=" ">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold ">{Object.keys(groupedTrips).length}</p>
                  <p className="text-sm ">Jours de livraison</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des trajets par jour */}
        <div className="space-y-6">
          {Object.entries(groupedTrips).map(([date, trips]) => (
            <Card key={date} className=" ">
              <CardHeader className=" border-b ">
                <CardTitle className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  <span className="capitalize ">{formatDate(date)}</span>
                  <Badge variant="outline" className="ml-auto border-gray-700 ">
                    {trips.length} trajet{trips.length > 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <Card
                      key={trip.id}
                      className={`border-l-4 border-l-blue-500 transition-all hover:shadow-lg cursor-pointer   ${selectedTrip?.id === trip.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                      onClick={() => setSelectedTrip(selectedTrip?.id === trip.id ? null : trip)}
                    >
                      <CardContent className="p-5">
                        <div className="space-y-4">
                          {/* En-tête du trajet */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className=" font-mono border-blue-500/30 text-blue-400">
                                {trip.id}
                              </Badge>
                              <div>
                                <p className="font-semibold text-lg ">{trip.client.name}</p>
                                <p className="text-sm ">{trip.client.phone}</p>
                              </div>
                            </div>
                            <Badge className=" text-blue-400 font-semibold border border-blue-500/30">
                              {trip.time}
                            </Badge>
                          </div>

                          {/* Informations du trajet */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs  font-semibold uppercase">Départ</p>
                                  <p className="text-sm font-medium ">{trip.departure}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs  font-semibold uppercase">Arrivée</p>
                                  <p className="text-sm font-medium ">{trip.arrival}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-3  p-3 rounded-lg border ">
                                <Clock className="w-5 h-5 " />
                                <div>
                                  <p className="text-xs ">Durée estimée</p>
                                  <p className="text-sm font-semibold ">{trip.estimatedDuration}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3  p-3 rounded-lg border ">
                                <Navigation className="w-5 h-5 " />
                                <div>
                                  <p className="text-xs ">Distance</p>
                                  <p className="text-sm font-semibold ">{trip.distance}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Nombre de commandes */}
                          <div className="flex items-center gap-3 bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                            <Box className="w-5 h-5 text-orange-400" />
                            <div className="flex-1">
                              <p className="text-xs  font-semibold uppercase">Nombre de commandes</p>
                              <p className="text-sm font-medium ">{trip.nombreCommande}</p>
                            </div>
                          </div>

                          {/* Détails supplémentaires (affichés si sélectionné) */}
                          {selectedTrip?.id === trip.id && (
                            <div className="pt-4 border-t  space-y-3 animate-in fade-in duration-300">
                              <div className="flex items-center gap-3  p-3 rounded-lg border border-blue-500/20">
                                <User className="w-5 h-5 text-blue-400" />
                                <div className="flex-1">
                                  <p className="text-xs  font-semibold uppercase">Détails du colis</p>
                                  <p className="text-sm font-medium ">{trip.packageDetails}</p>
                                </div>
                              </div>


                              <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 border-gray-700  hover:bg-gray-800">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  Voir l'itinéraire
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcommingTrips;