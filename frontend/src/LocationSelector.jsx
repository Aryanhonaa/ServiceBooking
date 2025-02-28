import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const LocationSelector = () => {
  const [position, setPosition] = useState(null);

  // Component to handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        setPosition(event.latlng); // Updates position with the clicked location
      },
    });
    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  };

  return (
    <MapContainer
      center={[27.7172, 85.3240]} // Initial map center (latitude, longitude)
      zoom={13} // Initial zoom level
      style={{ height: '400px', width: '100%' }} // Adjust height/width as needed
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
      />
      <MapClickHandler />
    </MapContainer>
  );
};

export default LocationSelector;
