import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ParkingMap } from './components/ParkingMap';
import { useParkingStore } from './store/parkingStore';
import { useParkingData } from './hooks/useParkingData';
function App() {
    const { spots, selectedSpot, setSelectedSpot } = useParkingStore();
    const { loading, error, handleMapMove } = useParkingData(42.3601, -71.0589, 50); // Boston coordinates
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-100 flex items-center justify-center", children: _jsx("div", { className: "text-xl font-semibold text-gray-600", children: "Loading parking data..." }) }));
    }
    if (error) {
        return (_jsx("div", { className: "min-h-screen bg-gray-100 flex items-center justify-center", children: _jsx("div", { className: "text-xl font-semibold text-red-600", children: error }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-100 p-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-8", children: "Real-Time Truck Parking Monitor" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(ParkingMap, { spots: spots, onSpotSelect: setSelectedSpot, onMapMove: handleMapMove }) }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Parking Information" }), selectedSpot ? (_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-medium", children: ["Spot ", selectedSpot.number] }), _jsxs("div", { className: "mt-4 space-y-2", children: [_jsxs("p", { children: ["Status: ", _jsx("span", { className: selectedSpot.isOccupied ? 'text-red-600' : 'text-green-600', children: selectedSpot.isOccupied ? 'Occupied' : 'Available' })] }), _jsxs("p", { children: ["Dimensions: ", selectedSpot.dimensions.length, "' x ", selectedSpot.dimensions.width, "'"] }), _jsxs("p", { children: ["Last Updated: ", selectedSpot.lastUpdated.toLocaleTimeString()] }), _jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "font-medium", children: "Amenities:" }), _jsxs("ul", { className: "mt-2 space-y-1", children: [selectedSpot.amenities.electric && _jsx("li", { children: "\u2713 Electric Hookup" }), selectedSpot.amenities.water && _jsx("li", { children: "\u2713 Water Access" }), selectedSpot.amenities.security && _jsx("li", { children: "\u2713 24/7 Security" })] })] })] })] })) : (_jsx("p", { className: "text-gray-500", children: "Select a parking spot on the map to view details" })), _jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Available Spots" }), _jsxs("p", { className: "text-2xl font-bold text-green-600", children: [spots.filter(spot => !spot.isOccupied).length, " / ", spots.length] })] })] })] })] }) }));
}
export default App;
