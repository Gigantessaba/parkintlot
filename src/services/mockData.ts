
import { TruckSpot } from '../types';

// Generate mock parking spots around a given location
export const generateMockSpots = (lat: number, lng: number, count: number = 20): TruckSpot[] => {
  return Array.from({ length: count }, (_, i): TruckSpot => ({
    id: `spot-${i + 1}`,  // Convert id to string to match type definition
    number: `SPOT-${i + 1}`,
    isOccupied: Math.random() > 0.6,
    lastUpdated: new Date(),
    location: {
      lat: lat + (Math.random() - 0.5) * 0.02,
      lng: lng + (Math.random() - 0.5) * 0.02,
    },
    truckType: "small",  // Adding truckType to match TruckSpot definition
    amenities: [
      Math.random() > 0.5 ? 'electric' : '',
      Math.random() > 0.5 ? 'water' : '',
      Math.random() > 0.3 ? 'security' : '',
    ].filter(Boolean) as string[],  // Convert amenities to string[]
  }));
};
