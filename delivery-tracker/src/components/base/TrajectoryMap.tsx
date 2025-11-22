import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { MapBoundsProps, TrajectoryMapProps } from '@/types/types';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Types









// Custom icons for start and end markers
const startIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.7082 0.1393 96.7240)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  `),
  iconSize: [20, 20],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const endIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="oklch(0.7082 0.1393 96.7240)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/>
      <line x1="10" y1="1" x2="10" y2="4"/>
      <line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  `),
  iconSize: [20, 20],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Component to fit map bounds to trajectory
function MapBounds({ points }: MapBoundsProps) {
  const map = useMap();
  
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(
        points.map(p => [p.latitude, p.longitude] as L.LatLngTuple)
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  
  return null;
}

function TrajectoryMap({ trajectoryArray }: TrajectoryMapProps) {
  const points = trajectoryArray?.points || [];
  const pathCoordinates: L.LatLngTuple[] = points.map(p => [p.latitude, p.longitude]);

  // Default center (Tunisia)
  const defaultCenter: L.LatLngTuple = [35.8245, 10.6346];
  const center: L.LatLngTuple = points.length > 0 
    ? [points[0].latitude, points[0].longitude] 
    : defaultCenter;

  if (!trajectoryArray || points.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">No trajectory data available</p>
      </div>
    );
  }

  const dark = document.getElementsByClassName('dark');


  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {
            dark.length > 0 ? (
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
            ) : (
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
            )
        }
        
        <MapBounds points={points} />
        
        {/* Draw the trajectory line */}
        {pathCoordinates.length > 1 && (
          <Polyline
            positions={pathCoordinates}
            color="oklch(0.7082 0.1393 96.7240)"
            weight={4}
            opacity={0.7}
          />
        )}
        
        {/* Start marker */}
        {points.length > 0 && (
          <Marker
            position={[points[0].latitude, points[0].longitude]}
            icon={startIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong>Start Point</strong>
                <br />
                {new Date(points[0].timestamp).toLocaleString()}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* End marker */}
        {points.length > 1 && (
          <Marker
            position={[points[points.length - 1].latitude, points[points.length - 1].longitude]}
            icon={endIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong>End Point</strong>
                <br />
                {new Date(points[points.length - 1].timestamp).toLocaleString()}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default TrajectoryMap;