import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
// MapEvents component to handle map movement
const MapEvents = ({ onMapMove, setShowSearchButton }) => {
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
const SearchAreaButton = ({ onSearch }) => {
    return (_jsx("div", { className: "leaflet-top leaflet-center", style: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, children: _jsx("div", { className: "leaflet-control", children: _jsx("button", { onClick: onSearch, className: "px-4 py-2 bg-white rounded-md shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500", children: "Search this area" }) }) }));
};
// Map Controller Component
const MapController = ({ onMapMove, showSearchButton, setShowSearchButton }) => {
    const map = useMap();
    const handleSearch = useCallback(() => {
        const center = map.getCenter();
        onMapMove({ lat: center.lat, lng: center.lng });
        setShowSearchButton(false);
    }, [map, onMapMove, setShowSearchButton]);
    return showSearchButton ? _jsx(SearchAreaButton, { onSearch: handleSearch }) : null;
};
export const ParkingMap = ({ spots, onSpotSelect, onMapMove }) => {
    const [showSearchButton, setShowSearchButton] = useState(false);
    const customIcon = new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    const redIcon = new Icon(Object.assign(Object.assign({}, customIcon.options), { iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' }));
    return (_jsxs(MapContainer, { center: [42.3601, -71.0589], zoom: 13, style: { height: '500px', width: '100%' }, children: [_jsx(TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }), _jsx(MapEvents, { onMapMove: onMapMove, setShowSearchButton: setShowSearchButton }), _jsx(MapController, { onMapMove: onMapMove, showSearchButton: showSearchButton, setShowSearchButton: setShowSearchButton }), spots.map((spot) => (_jsx(Marker, { position: [spot.location.lat, spot.location.lng], icon: spot.isOccupied ? redIcon : customIcon, eventHandlers: {
                    click: () => onSpotSelect(spot),
                }, children: _jsx(Popup, { children: _jsxs("div", { className: "text-sm", children: [_jsxs("h3", { className: "font-bold", children: ["Spot ", spot.number] }), _jsxs("p", { children: ["Status: ", spot.isOccupied ? 'Occupied' : 'Available'] }), _jsxs("p", { children: ["Last Updated: ", spot.lastUpdated.toLocaleTimeString()] })] }) }) }, spot.id)))] }));
};
