export interface ParkingSpot {
  id: string;
  number: string;
  isOccupied: boolean;
  lastUpdated: Date;
  location: { lat: number; lng: number };
  amenities: ('electric' | 'water' | 'security')[];
  vehicleInfo?: { plate: string }; // Optional property
}

export interface ParkingState {
  spots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  updateSpots: (spots: ParkingSpot[]) => void;
  updateSpotStatus: (spotId: string, isOccupied: boolean) => void;
  setSelectedSpot: (spot: ParkingSpot | null) => void;
}
