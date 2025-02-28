import React from 'react'
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = React.memo(({ serviceData }) => {


    const lat= serviceData.address?.lat || 0;
    const lng= serviceData.address?.lng|| 0;

    if(lat )
    return (
      <MapContainer center={[lat,lng]} zoom={13} style={{ width: '100%', height: '400px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]}>
          <Popup>Location</Popup>
        </Marker>
      </MapContainer>
    );
  });
export default Map;
