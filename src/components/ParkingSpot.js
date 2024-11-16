import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
export const ParkingSpot = ({ spot, onPark, onExit }) => {
    var _a, _b;
    const handlePark = () => {
        const plate = prompt('Enter vehicle plate number:');
        if (plate) {
            onPark(plate);
        }
    };
    return (_jsxs("div", { className: `p-4 border rounded-lg ${spot.isOccupied ? 'bg-red-100 border-red-300' : 'bg-green-100 border-green-300'}`, children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["Spot ", spot.number] }), spot.isOccupied && (_jsx("button", { onClick: onExit, className: "p-1 hover:bg-red-200 rounded-full", children: _jsx(XMarkIcon, { className: "w-5 h-5 text-red-600" }) }))] }), spot.isOccupied ? (_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: (_a = spot.vehicleInfo) === null || _a === void 0 ? void 0 : _a.plate }), _jsxs("div", { className: "flex items-center text-sm text-gray-500 mt-1", children: [_jsx(ClockIcon, { className: "w-4 h-4 mr-1" }), (_b = spot.vehicleInfo) === null || _b === void 0 ? void 0 : _b.entryTime.toLocaleTimeString()] })] })) : (_jsx("button", { onClick: handlePark, className: "w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors", children: "Park Vehicle" }))] }));
};
