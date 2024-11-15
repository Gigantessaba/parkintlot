import React from 'react';
import { ParkingSpot as ParkingSpotType } from '../types';
import { ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
  spot: ParkingSpotType;
  onPark: (plate: string) => void;
  onExit: () => void;
}

export const ParkingSpot: React.FC<Props> = ({ spot, onPark, onExit }) => {
  const handlePark = () => {
    const plate = prompt('Enter vehicle plate number:');
    if (plate) {
      onPark(plate);
    }
  };

  return (
    <div 
      className={`p-4 border rounded-lg ${
        spot.isOccupied ? 'bg-red-100 border-red-300' : 'bg-green-100 border-green-300'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Spot {spot.number}</h3>
        {spot.isOccupied && (
          <button
            onClick={onExit}
            className="p-1 hover:bg-red-200 rounded-full"
          >
            <XMarkIcon className="w-5 h-5 text-red-600" />
          </button>
        )}
      </div>
      
      {spot.isOccupied ? (
        <div>
          <p className="text-sm font-medium">{spot.vehicleInfo?.plate}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <ClockIcon className="w-4 h-4 mr-1" />
            {spot.vehicleInfo?.entryTime.toLocaleTimeString()}
          </div>
        </div>
      ) : (
        <button
          onClick={handlePark}
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Park Vehicle
        </button>
      )}
    </div>
  );
};