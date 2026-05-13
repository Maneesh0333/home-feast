"use client";

import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useEffect } from "react";

import L from "leaflet";

// Fix marker icons
delete (
  L.Icon.Default.prototype as L.Icon.Default & {
    _getIconUrl?: string;
  }
)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  location: [number, number]; // [lat, lng]
  onChange: (location: [number, number]) => void;
};

function RecenterMap({ location }: Props) {
  const map = useMap();

  useEffect(() => {
    map.setView(location, 13);
  }, [location, map]);

  return null;
}

function LocationPicker({ location, onChange }: Props) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker position={location}>
      <Popup>Your location</Popup>
    </Marker>
  );
}

function LeafletMaps({ location, onChange }: Props) {
  return (
    <MapContainer
      center={location}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap location={location} onChange={onChange} />

      <LocationPicker location={location} onChange={onChange} />
    </MapContainer>
  );
}

export default LeafletMaps;
