import React, { useCallback, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { TruckSpot } from '../types';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

interface Props {
  spots: TruckSpot[];
  onSpotSelect: (spot: TruckSpot) => void;
  onMapMove: (center: { lat: number; lng: number }) => void;
}

// MapEvents component to handle map movement
const MapEvents: React.FC<{ 
  onMapMove: (center: { lat: number; lng: number }) => void,
  setShowSearchButton: (show: boolean) => void 
}> = ({ onMapMove, setShowSearchButton }) => {
  useMapEvents({
    movestart: () => {
      setShowSearchButton(false);
    },
    moveend: () => {
      setShowSearchButton(true);
    },
  });
  return null;
};

// Search Area Button Component
const SearchAreaButton: React.FC<{ onSearch: () => void }> = ({ onSearch }) => {
  return (
    <div className="leaflet-top leaflet-center" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <div className="leaflet-control">
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-white rounded-md shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search this area
        </button>
      </div>
    </div>
  );
};

// Map Controller Component
const MapController: React.FC<{
  onMapMove: (center: { lat: number; lng: number }) => void;
  showSearchButton: boolean;
  setShowSearchButton: (show: boolean) => void;
}> = ({ onMapMove, showSearchButton, setShowSearchButton }) => {
  const map = useMap();

  const handleSearch = useCallback(() => {
    const center = map.getCenter();
    onMapMove({ lat: center.lat, lng: center.lng });
    setShowSearchButton(false);
  }, [map, onMapMove, setShowSearchButton]);

  return showSearchButton ? <SearchAreaButton onSearch={handleSearch} /> : null;
};

export const ParkingMap: React.FC<Props> = ({ spots, onSpotSelect, onMapMove }) => {
  const [showSearchButton, setShowSearchButton] = useState(false);

  const customIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const redIcon = new Icon({
    ...customIcon.options,
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  });

  return (
    <MapContainer
      center={[42.3601, -71.0589]}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents onMapMove={onMapMove} setShowSearchButton={setShowSearchButton} />
      <MapController 
        onMapMove={onMapMove}
        showSearchButton={showSearchButton}
        setShowSearchButton={setShowSearchButton}
      />
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.location.lat, spot.location.lng]}
          icon={spot.isOccupied ? redIcon : customIcon}
          eventHandlers={{
            click: () => onSpotSelect(spot),
          }}
        >
          <Popup>
            <div className="text-sm">
              <h3 className="font-bold">Spot {spot.number}</h3>
              <p>Status: {spot.isOccupied ? 'Occupied' : 'Available'}</p>
              <p>Last Updated: {spot.lastUpdated.toLocaleTimeString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};