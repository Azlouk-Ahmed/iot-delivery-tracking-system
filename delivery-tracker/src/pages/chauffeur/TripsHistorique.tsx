import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, Calendar, Navigation, CheckCircle, TrendingUp, Package, Truck, Box } from 'lucide-react';

const CURRENT_TRIP = {
  driver: 'Jean Dupont',
  driverId: 'DRV123',
  vehicleId: 'VEH456',
};

// Données de l'historique
const HISTORY_TRIPS = [
  {
    id: 'TRJ000',
    date: '2025-11-10',
    time: '15:45',
    client: {
      name: 'Leila Mansour',
      phone: '+216 98 111 222'
    },
    departure: 'Port de La Goulette',
    arrival: '12 Rue du Pacha, Sidi Bou Said',
    status: 'completed',
    duration: '45 min',
    estimatedDuration: '40 min',
    distance: '8 km',
    completedAt: '16:30',
    packageDetails: 'Colis fragile - 3kg',
    nombreCommande: '2 commandes',
  },
  {
    id: 'TRJ-001',
    date: '2025-11-10',
    time: '11:20',
    client: {
      name: 'Karim Bouzid',
      phone: '+216 97 333 444'
    },
    departure: 'Gare de Tunis',
    arrival: '33 Avenue Farhat Hached, Ben Arous',
    status: 'completed',
    duration: '30 min',
    estimatedDuration: '35 min',
    distance: '12 km',
    completedAt: '11:50',
    packageDetails: 'Documents - 0.5kg',
    nombreCommande: '5 commandes',
  },
  {
    id: 'TRJ-002',
    date: '2025-11-10',
    time: '09:00',
    client: {
      name: 'Amira Saidi',
      phone: '+216 55 555 666'
    },
    departure: 'Medina de Tunis',
    arrival: '67 Avenue de Paris, Tunis',
    status: 'completed',
    duration: '25 min',
    estimatedDuration: '20 min',
    distance: '5 km',
    completedAt: '09:25',
    packageDetails: 'Colis standard - 4kg',
    nombreCommande: '1 commande',
  },
  {
    id: 'TRJ-003',
    date: '2025-11-09',
    time: '16:30',
    client: {
      name: 'Youssef Hamdi',
      phone: '+216 29 777 888'
    },
    departure: 'Centre Ville, Tunis',
    arrival: '45 Rue de Marseille, Le Bardo',
    status: 'completed',
    duration: '35 min',
    estimatedDuration: '30 min',
    distance: '9 km',
    completedAt: '17:05',
    packageDetails: 'Colis express - 6kg',
    nombreCommande: '3 commandes',
  },
  {
    id: 'TRJ-004',
    date: '2025-11-09',
    time: '14:00',
    client: {
      name: 'Sonia Belaid',
      phone: '+216 22 999 000'
    },
    departure: 'Lac 2, Tunis',
    arrival: '78 Avenue Kheireddine Pacha, La Marsa',
    status: 'completed',
    duration: '40 min',
    estimatedDuration: '45 min',
    distance: '15 km',
    completedAt: '14:40',
    packageDetails: 'Bagage - 12kg',
    nombreCommande: '4 commandes',
  },
  {
    id: 'TRJ-005',
    date: '2025-11-09',
    time: '10:15',
    client: {
      name: 'Tarek Messaoudi',
      phone: '+216 98 123 789'
    },
    departure: 'Aéroport Tunis-Carthage',
    arrival: '23 Rue Ibn Sina, Carthage',
    status: 'completed',
    duration: '20 min',
    estimatedDuration: '25 min',
    distance: '6 km',
    completedAt: '10:35',
    packageDetails: 'Colis standard - 8kg',
    nombreCommande: '2 commandes',
  },
  {
    id: 'TRJ-006',
    date: '2025-11-08',
    time: '17:00',
    client: {
      name: 'Nadia Khalil',
      phone: '+216 55 456 123'
    },
    departure: 'Souk El Attarine, Tunis',
    arrival: '90 Avenue Habib Bourguiba, Tunis',
    status: 'completed',
    duration: '15 min',
    estimatedDuration: '15 min',
    distance: '3 km',
    completedAt: '17:15',
    packageDetails: 'Documents - 1kg',
    nombreCommande: '1 commande',
  }
];

type Trip = typeof HISTORY_TRIPS[0];

const TripsHistorique = () => {
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
    HISTORY_TRIPS.forEach(trip => {
      if (!grouped[trip.date]) {
        grouped[trip.date] = [];
      }
      grouped[trip.date].push(trip);
    });
    return grouped;
  };

  const calculateStats = () => {
    const totalDistance = HISTORY_TRIPS.reduce((sum, trip) => sum + parseInt(trip.distance), 0);
    const totalTrips = HISTORY_TRIPS.length;
    const totalCommandes = HISTORY_TRIPS.reduce((sum, trip) => {
      // Extraire le nombre de commandes (premier caractère numérique)
      const nbCommandes = parseInt(trip.nombreCommande);
      return sum + (isNaN(nbCommandes) ? 0 : nbCommandes);
    }, 0);

    return { totalDistance, totalTrips, totalCommandes };
  };

  const groupedTrips = groupTripsByDate();
  const stats = calculateStats();

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Historique des trajets</CardTitle>
            <p className="">Tous vos trajets effectués avec succès</p>
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

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className=" ">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalTrips}</p>
                  <p className="text-sm ">Trajets terminés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className=" ">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/20 p-3 rounded-lg">
                  <Box className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalCommandes}</p>
                  <p className="text-sm ">Total commandes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className=" ">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Navigation className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalDistance} km</p>
                  <p className="text-sm ">Distance totale</p>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card className=" ">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{Object.keys(groupedTrips).length}</p>
                  <p className="text-sm ">Jours actifs</p>
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
                  <Calendar className="w-6 h-6 text-green-400" />
                  <span className="capitalize">{formatDate(date)}</span>
                  <Badge variant="outline" className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
                    {trips.length} trajet{trips.length > 1 ? 's' : ''} terminé{trips.length > 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <Card
                      key={trip.id}
                      className={`border-l-4 border-l-green-500 transition-all hover:shadow-lg cursor-pointer   ${selectedTrip?.id === trip.id ? 'ring-2 ring-green-500' : ''
                        }`}
                      onClick={() => setSelectedTrip(selectedTrip?.id === trip.id ? null : trip)}
                    >
                      <CardContent className="p-5">
                        <div className="space-y-4">
                          {/* En-tête du trajet */}
                          <div className="flex items-start justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="bg-green-500/20 font-mono border-green-500/30 text-green-400">
                                {trip.id}
                              </Badge>
                              <div>
                                <p className="font-semibold text-lg">{trip.client.name}</p>
                                <p className="text-sm ">{trip.client.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-500/20 text-green-400 font-semibold border border-green-500/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Terminé
                              </Badge>
                              <Badge variant="outline" className="border-gray-700 ">
                                {trip.time} - {trip.completedAt}
                              </Badge>
                            </div>
                          </div>

                          {/* Informations du trajet */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500 font-semibold uppercase">Départ</p>
                                  <p className="text-sm font-medium text-gray-300">{trip.departure}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500 font-semibold uppercase">Arrivée</p>
                                  <p className="text-sm font-medium text-gray-300">{trip.arrival}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-3  p-3 rounded-lg border ">
                                <Clock className="w-5 h-5 " />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500">Durée réelle</p>
                                  <p className="text-sm font-semibold text-gray-300">
                                    {trip.duration}
                                    <span className="text-xs text-gray-500 ml-2">
                                      (estimé: {trip.estimatedDuration})
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3  p-3 rounded-lg border ">
                                <Navigation className="w-5 h-5 " />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500">Distance parcourue</p>
                                  <p className="text-sm font-semibold text-gray-300">{trip.distance}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Nombre de commandes */}
                          <div className="flex items-center gap-3 bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                            <Box className="w-5 h-5 text-orange-400" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 font-semibold uppercase">Nombre de commandes</p>
                              <p className="text-sm font-medium text-gray-300">{trip.nombreCommande}</p>
                            </div>
                          </div>

                          {/* Détails supplémentaires (affichés si sélectionné) */}
                          {selectedTrip?.id === trip.id && (
                            <div className="pt-4 border-t  space-y-3 animate-in fade-in duration-300">
                              <div className="flex items-center gap-3 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                                <Package className="w-5 h-5 text-blue-400" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 font-semibold uppercase">Détails du colis</p>
                                  <p className="text-sm font-medium text-gray-300">{trip.packageDetails}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className=" p-3 rounded-lg border ">
                                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Heure de départ</p>
                                  <p className="text-sm font-medium text-gray-300">{trip.time}</p>
                                </div>
                                <div className=" p-3 rounded-lg border ">
                                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Heure d'arrivée</p>
                                  <p className="text-sm font-medium text-gray-300">{trip.completedAt}</p>
                                </div>
                              </div>

                              <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                                <MapPin className="w-4 h-4 mr-2" />
                                Voir le parcours détaillé
                              </Button>
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

export default TripsHistorique;