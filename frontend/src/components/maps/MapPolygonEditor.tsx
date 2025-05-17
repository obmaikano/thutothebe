import React, { useState, useRef } from 'react';
import { Control, Controller } from 'react-hook-form';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapPolygonEditorProps {
  control: Control<any>;
  name: string;
}

export const MapPolygonEditor: React.FC<MapPolygonEditorProps> = ({ control, name }) => {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Project Area</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <MapContainer 
            center={[0, 0]} 
            zoom={2} 
            style={{ height: '300px', width: '100%' }}
            ref={(map) => (mapRef.current = map)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <FeatureGroup>
              <EditControl
                position="topright"
                onCreated={(e) => {
                  const layer = e.layer as L.Polygon;
                  if (layer instanceof L.Polygon) {
                    // Get the polygon points
                    const latLngs = layer.getLatLngs();
                    // Make sure latLngs is an array of arrays
                    if (Array.isArray(latLngs) && latLngs.length > 0) {
                      // Make sure the first element is an array
                      if (Array.isArray(latLngs[0])) {
                        const coordinates = (latLngs[0] as L.LatLng[]).map((latlng: L.LatLng) => [latlng.lng, latlng.lat]);
                        field.onChange({
                          type: 'Polygon',
                          coordinates: [coordinates],
                        });
                      }
                    }
                  }
                }}
                onEdited={(e) => {
                  const layers = e.layers;
                  layers.eachLayer((layer: L.Layer) => {
                    const polygon = layer as L.Polygon;
                    if (polygon instanceof L.Polygon) {
                      const latLngs = polygon.getLatLngs();
                      if (Array.isArray(latLngs) && latLngs.length > 0) {
                        if (Array.isArray(latLngs[0])) {
                          const coordinates = (latLngs[0] as L.LatLng[]).map((latlng: L.LatLng) => [latlng.lng, latlng.lat]);
                          field.onChange({
                            type: 'Polygon',
                            coordinates: [coordinates],
                          });
                        }
                      }
                    }
                  });
                }}
                onDeleted={() => {
                  field.onChange({
                    type: 'Polygon',
                    coordinates: [[]],
                  });
                }}
                draw={{
                  rectangle: false,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                  polyline: false,
                  polygon: true,
                }}
              />
            </FeatureGroup>
          </MapContainer>
        )}
      />
      <p className="mt-1 text-sm text-gray-500">
        Draw a polygon to define the project area. Use the toolbar on the right to create, edit, or delete shapes.
      </p>
    </div>
  );
}; 