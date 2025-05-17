import React from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapDisplayProps {
  areaGeometry: {
    type: string;
    coordinates: number[][][];
  };
  height?: string;
}

export const MapDisplay: React.FC<MapDisplayProps> = ({ areaGeometry, height = '300px' }) => {
  // Convert GeoJSON coordinates to Leaflet LatLng[]
  // GeoJSON is [longitude, latitude], Leaflet uses [latitude, longitude]
  const positions = areaGeometry?.coordinates?.[0]?.map(
    coord => [coord[1], coord[0]] as [number, number]
  ) || [];

  // Calculate center of polygon if positions exist
  const center = positions.length > 0
    ? positions.reduce(
        (acc, val) => [acc[0] + val[0] / positions.length, acc[1] + val[1] / positions.length], 
        [0, 0]
      ) as [number, number]
    : [0, 0] as [number, number];

  // Default zoom level
  const zoom = positions.length ? 10 : 2;

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height, width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {positions.length > 0 && (
        <Polygon 
          positions={positions}
          pathOptions={{
            color: 'blue',
            fillColor: '#3388ff',
            fillOpacity: 0.2
          }}
        />
      )}
    </MapContainer>
  );
}; 