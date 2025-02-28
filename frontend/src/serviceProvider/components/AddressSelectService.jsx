import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { CiSearch } from "react-icons/ci";

const AddressSelectService = ({ onAddressSelect }) => {
    const [position, setPosition] = useState([27.7172, 85.3240]);
    const [address, setAddress] = useState({
      street: '',
      city: '',
      country: '',
      lat:null,
      lng:null
    });
    const [query, setQuery] = useState('');
  
    // When the map is clicked, update the marker position and do reverse geocoding.
    const LocationMarker = () => {
      useMapEvents({
        click(e) {
          const { lat, lng } = e.latlng;
          setPosition([lat, lng]);
  
          // Reverse geocode the clicked location.
          axios
            .get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then((response) => {
              const addrData = response.data.address;
              const selectedAddress = {
                street: addrData.road || '',
                city: addrData.city || addrData.town || addrData.village || '',
                country: addrData.country || '',
                lat,
                lng
              };
              setAddress(selectedAddress);
              onAddressSelect(selectedAddress);
            })
            .catch((err) => {
              console.error("Reverse geocoding error: ", err);
            });
        },
      });
      return (
        <Marker position={position}>
          <Popup>
            {address.street || address.city || address.country
              ? `${address.street}, ${address.city}, ${address.country}`
              : "Click on the map to select an address"}
          </Popup>
        </Marker>
      );
    };
  
    // Handle search for a place.
    const handleSearch = () => {
      if (query.trim() === '') return;
  
      axios
        .get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            const newPos = [parseFloat(lat), parseFloat(lon)];
            setPosition(newPos);
  
            // Reverse geocode for the searched location so we have address details.
            axios
              .get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
              .then((res) => {
                const addrData = res.data.address;
                const selectedAddress = {
                  street: addrData.road || '',
                  city: addrData.city || addrData.town || addrData.village || '',
                  country: addrData.country || '',
                  lat:parseFloat(lat),
                  lng:parseFloat(lon)
                };
                setAddress(selectedAddress);
                onAddressSelect(selectedAddress);
              })
              .catch((err) => {
                console.error("Reverse geocoding error on search: ", err);
              });
          } else {
            console.warn("No results found");
          }
        })
        .catch((error) => {
          console.error("Search error: ", error);
        });
    };
  
  return (
    <div>
    {/* Search Input */}
    <div className="flex justify-center mt-10">
<div className="flex items-center border border-black rounded-lg p-1 w-80">
  <input
    type="text"
    value={query}
    onChange={(e) => 
        {
          const value=e.target.value;
          setQuery(value.charAt(0).toUpperCase()+ value.slice(1));
        }  

    }
    placeholder="Search place"
    className="w-full px-3 py-2 outline-none"
    onKeyDown={(e)=>{
      if(e.key ==="Enter"){
        handleSearch()
      }
    }}
    
  />
  <CiSearch 
    onClick={handleSearch} 
    className="text-black cursor-pointer p-1" 
    size={30} 
  />
</div>
</div>

    {/* Map */}
    <MapContainer center={position} zoom={13} style={{ width: '100%', height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  </div>
  )
}






export default AddressSelectService;