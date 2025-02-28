import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MyMapComponent = () => {
  return (
    <MapContainer
      center={[51.505, -0.09]} // Coordinates for London
      zoom={13}
      style={{ width: '100%', height: '500px' }} // Ensure the map has a height
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
};

export default MyMapComponent;
